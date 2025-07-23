// En e2e/teardown.ts
import pool from '../src/infrastructure/database/postgres.connection';

/**
 * Global teardown que se ejecuta UNA SOLA VEZ después de que TODOS los tests han terminado.
 * - Cierra el pool de conexiones a la base de datos para permitir que Jest termine limpiamente.
 */
export default async () => {
  await pool.end();
};