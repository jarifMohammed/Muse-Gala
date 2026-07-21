import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`, {
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
    });
    res.status(500).json({ error: err.message });
};

export default errorHandler;

