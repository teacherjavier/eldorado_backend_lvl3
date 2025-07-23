import { Pool } from 'pg';
import logger from '../logging/logger';

/**
 * @file Módulo de Conexión a la Base de Datos PostgreSQL.
 * @description Este archivo centraliza la configuración y creación de un pool de conexiones a la base de datos.
 * Se exporta una única instancia (Singleton) del pool para ser compartida y reutilizada en toda la aplicación,
 * lo cual es una práctica crucial para la eficiencia y el rendimiento en un entorno de servidor.
 */

/**
 * @const {Pool} pool
 * @description Instancia del pool de conexiones de PostgreSQL.
 * Se configura utilizando la variable de entorno `DATABASE_URL` para máxima portabilidad
 * entre entornos (desarrollo, testing, producción).
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // En un entorno de producción real con una base de datos remota,
  // aquí se configuraría SSL.
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

/**
 * @event connect
 * @description Listener para el evento 'connect' del pool.
 * Se dispara cada vez que un nuevo cliente se conecta al pool. Se utiliza aquí para
 * registrar un mensaje de éxito una sola vez, confirmando que la configuración
 * inicial de la base de datos es correcta y el servicio puede comunicarse con ella.
 */
pool.on('connect', () => {
  logger.info('Connection pool to database established successfully.');
});

/**
 * @event error
 * @description Listener para el evento 'error' del pool.
 * Captura errores en clientes que están inactivos en el pool. Es una medida de seguridad
 * y observabilidad vital para detectar problemas de red o de la base de datos
 * que puedan ocurrir de forma asíncrona.
 */
pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client in pool', {
    error: err.stack,
    client: client, // Podría ser útil para identificar el cliente específico
  });
});

export default pool;