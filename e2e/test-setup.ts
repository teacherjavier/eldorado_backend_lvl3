// En e2e/test-setup.ts
import pool from '../src/infrastructure/database/postgres.connection';

/**
 * Global setup que se ejecuta UNA sola vez antes de que comience la ejecución de todos los tests.
 * - Limpia la tabla `items` para garantizar un estado inicial limpio.
 * - Utiliza el pool de conexiones principal de la aplicación.
 */
export default async () => {
  // Limpia la base de datos usando la conexión principal de la app.
  await pool.query('TRUNCATE TABLE items RESTART IDENTITY CASCADE;');
  // NOTA: NO cerramos el pool aquí. Se usará durante los tests y se cerrará
  // de forma centralizada en el `globalTeardown`.
};