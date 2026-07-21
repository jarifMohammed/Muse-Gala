// app.js - FIXED ORDER FOR STRIPE WEBHOOK
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import xssClean from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import compression from 'compression';
import logger from './core/config/logger.js';
import errorHandler from './core/middlewares/errorMiddleware.js';
import notFound from './core/middlewares/notFound.js';
import appRouter from './core/app/appRouter.js';
import { stripeWebhookHandler } from './entities/webhook.js';
import { connectedAccountWebhookHandler } from './entities/webhookAccounts.js';
import { startReturnReminderJob } from './lib/returnReminderJob.js';
import { startOverdueEscalationJob } from './lib/overdueEscalationJob.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './core/config/swagger.js';
import basicAuth from 'express-basic-auth';
import { globalLimiter, swaggerLimiter } from './lib/limit.js';
//import { startReminderJob } from './lib/reminderJob.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);

// Stripe webhook route FIRST — must be raw body
app.post('/api/v1/webhook/main', express.raw({ type: 'application/json' }), stripeWebhookHandler);
app.post('/api/v1/webhook/connected', express.raw({ type: '*/*' }), connectedAccountWebhookHandler);


// Security middleware
app.use(helmet());

// CORS configuration - restrict to allowed origins
const allowedOrigins = [
  'https://musegala.com.au',
  'https://www.musegala.com.au',
  'https://lender.musegala.com.au',
  'https://admin.musegala.com.au',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:3001',
  'https://muse-gala-website-three.vercel.app',
  'https://muse-gala-website.vercel.app',
  'https://muse-gala-admin-dashboard.vercel.app',
  'https://muse-gala-lender-dashboard.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['set-cookie'],
}));
app.use(xssClean());
app.use(mongoSanitize());
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));
app.use(cookieParser());
app.use(compression());
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/v1/webhook/main') || req.originalUrl.startsWith('/api/v1/webhook/connected')) {
    // Skip JSON parsing, Stripe needs raw body
    return next();
  }
  express.json({ limit: '10mb' })(req, res, next);
});

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  // Add unique request ID
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);

  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const memUsedMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    logger.info({
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${durationMs.toFixed(2)}ms`,
      memoryMB: memUsedMB,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip
    });
  });

  next();
});


// Rate limiting
app.use(globalLimiter);

// Static files
const uploadPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadPath));


// Home route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});


// API routes
const swaggerAuth = basicAuth({
  users: { [process.env.SWAGGER_USER || 'admin']: process.env.SWAGGER_PASSWORD || 'musegala_secure_docs' },
  challenge: true,
});

app.use('/api-docs', swaggerLimiter, swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', appRouter);





// Socket IO setup
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
      'https://musegala.com.au',
      'https://www.musegala.com.au',
      'https://lender.musegala.com.au',
      'https://admin.musegala.com.au',
      'http://localhost:3000',
      'http://localhost:5173',
      'https://muse-gala-website.vercel.app',
      'https://muse-gala-admin-dashboard.vercel.app',
      'https://muse-gala-lender-dashboard.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  const queryUserId = socket.handshake.query.userId?.toString();
  if (queryUserId) {
    socket.data.userId = queryUserId;
    socket.join(`user-${queryUserId}`);
    console.log(`User ${queryUserId} joined personal room`);
  }

  socket.on("registerUser", (userId) => {
    const id = userId.toString();
    socket.data.userId = id;
    socket.join(`user-${id}`);
    console.log(`User ${id} joined personal room`);
  });

  socket.on("joinRoom", (room) => {
    socket.join(`room-${room}`);
    console.log(`Client joined chat room: ${room}`);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(`room-${room}`);
    console.log(`Client left chat room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


// registerUser → global communication || for personal notifications (new chat, new message alert).

// joinRoom → scoped communication || for live chat sessions (realtime messages inside the room).


// Error handling
app.use(notFound);
app.use(errorHandler);

logger.info('Middleware stack initialized');

// Start cron jobs
startReturnReminderJob();
startOverdueEscalationJob();
//startReminderJob();

export { server, app };
