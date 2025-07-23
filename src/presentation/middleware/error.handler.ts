import { Request, Response, NextFunction } from 'express';
import logger from '../../infrastructure/logging/logger';
import { ValidationError } from '../../application/errors/validation.error';
import { NotFoundError } from '../../application/errors/not-found.error';

/**
 * @function errorHandler
 * @description Middleware global de Express para manejar errores de forma centralizada.
 * Actúa como un "catch-all" al final de la cadena de middlewares.
 * Inspecciona la instancia del error para devolver una respuesta HTTP estructurada y apropiada,
 * asegurando que no se fugue información sensible en caso de errores inesperados.
 *
 * @param {Error} error - El objeto de error capturado, que puede ser una instancia de nuestras clases personalizadas.
 * @param {Request} req - El objeto de la petición de Express.
 * @param {Response} res - El objeto de la respuesta de Express.
 * @param {NextFunction} next - La función para pasar al siguiente middleware.
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Comprobación de tipo robusta usando 'instanceof'.
  if (error instanceof ValidationError) {
    logger.warn({ err: error }, 'Validation error occurred');
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  } else if (error instanceof NotFoundError) {
    logger.warn({ err: error }, 'Resource not found error occurred');
    res.status(404).json({
      status: 'error',
      message: error.message,
    });
  } else {
    // Para cualquier otro error no esperado, se considera un error del servidor (500).
    // Es CRUCIAL registrar el error completo con su stack trace para la depuración.
    logger.error(
      { err: error, stack: error.stack },
      'An unexpected internal server error occurred'
    );

    // Se devuelve una respuesta genérica al cliente para no exponer detalles de la implementación.
    res.status(500).json({
      status: 'error',
      message: 'An internal server error occurred.',
    });
  }
};
