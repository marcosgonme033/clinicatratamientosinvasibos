export const errorHandler = (err, req, res, next) => {
  console.error('[ERROR HANDLER]:', {
    message: err.message,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Para errores 500, no exponer detalles internos en producción
  const errorMessage = statusCode === 500 && process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : message;

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
};
