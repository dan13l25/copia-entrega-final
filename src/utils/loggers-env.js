import { devLogger, prodLogger } from "./loggers.js";

export const addLogger = (req, res, next) => {
    const env = process.env.NODE_ENV || 'development';
    req.logger = env === 'production' ? prodLogger : devLogger;

    req.logger.http(
        `${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`
    );
    next();
};
