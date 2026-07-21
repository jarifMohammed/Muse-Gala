import mongoose from 'mongoose';
import logger from './src/core/config/logger.js';
import { server } from './src/app.js';
import { mongoURI, port } from './src/core/config/config.js';
import { initSlaWorker } from './src/core/cron/slaWorker.js';

mongoose
  .connect(mongoURI, {
    maxPoolSize: 10,
    autoIndex: false,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    logger.info('MongoDB connected');
    initSlaWorker();
    
    const serverInstance = server.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });

    // Graceful Shutdown Logic
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      
      serverInstance.close(async () => {
        logger.info('HTTP server closed.');
        
        try {
          await mongoose.connection.close();
          logger.info('MongoDB connection closed.');
          process.exit(0);
        } catch (err) {
          logger.error('Error during MongoDB closure:', err);
          process.exit(1);
        }
      });

      // Force shutdown if it takes too long
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
  });
