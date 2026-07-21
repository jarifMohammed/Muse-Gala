import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Muse Gala API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Muse Gala backend system.',
      contact: {
        name: 'Muse Gala Support',
        url: 'https://musegala.com.au',
      },
    },
    servers: [
      {
        url: 'http://localhost:5004/api',
        description: 'Local development server',
      },
      {
        url: 'https://api.musegala.com.au/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/entities/**/*.routes.js'], // Scan all route files for @swagger comments
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
