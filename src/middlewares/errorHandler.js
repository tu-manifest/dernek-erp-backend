import { ERROR_MESSAGES, HTTP_STATUS, formatErrorMessage } from '../constants/errorMessages.js';

/**
 * Özel Hata Sınıfı
 */
export class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Merkezi Hata Yönetimi Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let { statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message } = err;

  // Sequelize Hataları
  if (err.name === 'SequelizeValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = err.errors.map(e => e.message).join(', ');
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = HTTP_STATUS.CONFLICT;
    message = ERROR_MESSAGES.DATABASE.DUPLICATE_ENTRY;
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = ERROR_MESSAGES.DATABASE.FOREIGN_KEY_CONSTRAINT;
  } else if (err.name === 'SequelizeDatabaseError') {
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    message = ERROR_MESSAGES.DATABASE.QUERY_FAILED;
  }

  // Loglama
  console.error('❌ Hata:', {
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method,
  });

  // Response
  res.status(statusCode).json({
    success: false,
    message: message || ERROR_MESSAGES.GENERAL.INTERNAL_SERVER,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(err.details && { details: err.details }),
  });
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route not found: ${req.originalUrl}`,
    HTTP_STATUS.NOT_FOUND
  );
  next(error);
};

/**
 * Async Handler Wrapper
 * Controller fonksiyonlarındaki try-catch bloklarını kaldırmak için
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default errorHandler;
