import pino from 'pino';

/**
 * @file Módulo de Logger para la aplicación.
 * @description Este archivo configura y exporta una instancia única (Singleton) del logger 'pino'.
 * Está diseñado para ser robusto y eficiente en producción, y al mismo tiempo, amigable 
 * y legible para el desarrollador en entornos locales.
 */

/**
 * @const {pino.LoggerOptions} options
 * @description Opciones de configuración para la instancia de pino.
 * Contiene la lógica para el nivel de log configurable y el transporte condicional.
 */
const options: pino.LoggerOptions = {
  /**
   * El nivel mínimo de log que se registrará.
   * Se puede sobreescribir con la variable de entorno LOG_LEVEL.
   * 'info' es un valor por defecto seguro y común para producción.
   * En desarrollo, se recomienda establecer LOG_LEVEL=debug en el archivo .env.
   */
  level: process.env.LOG_LEVEL || 'info',

  /**
   * Transporte condicional para formatear la salida del log.
   * Esta es la clave para tener una excelente experiencia de desarrollo sin sacrificar
   * el rendimiento en producción.
   */
  transport:
    // Si el entorno NO es producción...
    process.env.NODE_ENV !== 'production'
      // ...usamos pino-pretty para una salida bonita y legible.
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true, // Añade colores a la salida para mejorar la legibilidad.
            translateTime: 'SYS:dd-mm-yyyy HH:MM:ss', // Formato de fecha y hora legible.
            ignore: 'pid,hostname', // Oculta campos que son menos relevantes durante el desarrollo.
          },
        }
      // ...de lo contrario, en producción, no definimos transporte. Pino usará su formato
      // JSON por defecto, que es extremadamente rápido y perfecto para sistemas de logging.
      : undefined,
};

/**
 * @const {pino.Logger} logger
 * @description La instancia única y global del logger que será usada en toda la aplicación.
 * Se exporta como 'default' para facilitar su importación y asegurar que todos los módulos
 * compartan la misma instancia y configuración.
 */
const logger = pino(options);

export default logger;