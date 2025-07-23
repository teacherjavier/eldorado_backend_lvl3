// src/presentation/server.ts
import http from 'http';
import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import config from '../infrastructure/config';
import logger from '../infrastructure/logging/logger';
import itemRouter from './routes/item.routes';
import { errorHandler } from './middleware/error.handler';

/**
 * @file server.ts
 * @description Define la aplicación Express y ‑cuando procede‑ arranca el
 * listener HTTP.  Durante los tests (Jest) no se abre ningún puerto: se
 * exporta un “dummy server” con la misma interfaz para que los tests que
 * llaman a server.close() no fallen y, sobre todo, no queden handles TCP
 * abiertos que impidan a Jest finalizar.
 */

/* ─────────────────────────────────  APP  ────────────────────────────────── */
const app: Application = express();

/* Middleware base */
app.use(cors());
app.use(express.json());

/* ───── Swagger / OpenAPI ───── */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'El Dorado – Items API',
      version: '1.0.0',
      description:
        'API REST para la gestión de Items (prueba técnica El Dorado).'
    },
    servers: [{ url: '/api/v1', description: 'Servidor de Desarrollo' }],
    tags: [{ name: 'Items', description: 'Operaciones con Items' }],
    components: {
      schemas: {
        Item: {
          type: 'object',
          required: ['id', 'name', 'price'],
          properties: {
            id:    { type: 'string', format: 'uuid' },
            name:  { type: 'string' },
            price: { type: 'number', minimum: 0 }
          }
        },
        ItemInput: {
          type: 'object',
          required: ['name', 'price'],
          properties: {
            name:  { type: 'string' },
            price: { type: 'number', minimum: 0 }
          }
        }
      }
    }
  },
  apis: ['./src/presentation/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
logger.info('API documentation available at /api-docs');

/* ───── Rutas de dominio ───── */
app.use('/api/v1/items', itemRouter);

/* ───── Middleware de error (siempre al final) ───── */
app.use(errorHandler);

/* ───────────────────────────  LISTENER  ──────────────────────────────── */
/**
 * En ejecución normal arrancamos el servidor.  
 * Si estamos bajo Jest (`NODE_ENV==="test"` o `JEST_WORKER_ID` definido),
 * devolvemos un stub que cumple `.close(cb)` sin crear sockets.
 */
const runningUnderTest =
  process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

let server: http.Server & { isStarted?: boolean };

if (runningUnderTest) {
  // Stub minimal para que supertest o teardown puedan llamar a close().
  const dummy = { close: (cb?: (err?: Error) => void) => cb?.() } as unknown as http.Server;
  server = dummy;
  server.isStarted = false;
} else {
  server = app.listen(config.port, () => {
    logger.info(
      `Server is running on port ${config.port} in ${config.nodeEnv} mode.`
    );
  });
  server.isStarted = true;

  /* Apagado elegante sólo si el listener está activo */
  const graceful = (signal: string) => {
    logger.warn(`Received ${signal}. Shutting down gracefully…`);
    server.close(() => {
      logger.info('Server closed. Exiting process.');
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => graceful('SIGTERM'));
  process.on('SIGINT',  () => graceful('SIGINT'));
}

/* ────────────────────────────  EXPORTS  ──────────────────────────────── */
export { server }; // útil para teardown o tests legacy
export default app; // usado por supertest y adaptadores
