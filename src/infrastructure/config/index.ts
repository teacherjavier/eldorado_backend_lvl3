import dotenv from 'dotenv';

// Carga las variables de entorno desde un archivo .env al inicio del proceso.
// Es crucial que esto se ejecute antes de que cualquier otra parte de la app intente leer la configuración.
dotenv.config();

/**
 * @file Módulo de Configuración Centralizada.
 * @description Lee las variables de entorno, las valida, y las exporta como un objeto inmutable.
 * Este patrón evita el acceso directo a `process.env` en la aplicación, mejorando la
 * predictibilidad, la mantenibilidad y facilitando las pruebas.
 */


// --- Bloque de Validación ---
// Se valida la existencia y el tipo de las variables de entorno críticas.
// Si alguna validación falla, la aplicación termina con un error descriptivo.
// Esto sigue el principio de "fail-fast" (fallar rápido).

if (!process.env.DATABASE_URL) {
  console.error('FATAL ERROR: La variable de entorno DATABASE_URL no está definida.');
  process.exit(1); // Termina el proceso con un código de error.
}

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;

if (PORT === undefined || isNaN(PORT)) {
  console.error('FATAL ERROR: La variable de entorno PORT no está definida o no es un número válido.');
  process.exit(1); // Termina el proceso con un código de error.
}


/**
 * @const {object} config
 * @description Objeto inmutable que contiene toda la configuración de la aplicación derivada del entorno.
 * El uso de `Object.freeze` previene modificaciones accidentales de la configuración durante la ejecución.
 */
const config = Object.freeze({
  /**
   * El entorno de ejecución de la aplicación (ej: 'development', 'production').
   * @type {string}
   */
  nodeEnv: process.env.NODE_ENV || 'development',

  /**
   * El puerto en el que el servidor escuchará las peticiones. Su validez es comprobada al inicio.
   * @type {number}
   */
  port: PORT,

  /**
   * El nivel mínimo de log que se registrará.
   * @type {string}
   */
  logLevel: process.env.LOG_LEVEL || 'info',

  /**
   * La URL de conexión a la base de datos PostgreSQL. Su existencia es comprobada al inicio.
   * @type {string}
   */
  databaseUrl: process.env.DATABASE_URL,
});

export default config;