// src/presentation/routes/item.routes.ts
import { Router } from 'express';
import { ItemController } from '../controllers/item.controller';
import { CreateItemUseCase } from '../../application/use-cases/create-item.use-case';
import { GetAllItemsUseCase } from '../../application/use-cases/get-all-items.use-case';
import { GetItemByIdUseCase } from '../../application/use-cases/get-item-by-id.use-case';
import { UpdateItemUseCase } from '../../application/use-cases/update-item.use-case';
import { DeleteItemUseCase } from '../../application/use-cases/delete-item.use-case';
import { PostgresItemRepository } from '../../infrastructure/database/repositories/postgres.item.repository';
import pool from '../../infrastructure/database/postgres.connection';
import logger from '../../infrastructure/logging/logger';

// --- Raíz de Composición (Dependency Injection) ---
const itemRepository = new PostgresItemRepository(pool);
const createItemUseCase = new CreateItemUseCase(itemRepository);
const getAllItemsUseCase = new GetAllItemsUseCase(itemRepository);
const getItemByIdUseCase = new GetItemByIdUseCase(itemRepository);
const updateItemUseCase = new UpdateItemUseCase(itemRepository);
const deleteItemUseCase = new DeleteItemUseCase(itemRepository);

const itemController = new ItemController(
  logger,
  createItemUseCase,
  getAllItemsUseCase,
  getItemByIdUseCase,
  updateItemUseCase,
  deleteItemUseCase
);

const itemRouter = Router();

/**
 * @openapi
 * /items:
 *   get:
 *     tags:
 *       - Items
 *     summary: Retorna una lista de todos los items
 *     responses:
 *       '200':
 *         description: Una lista de items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
itemRouter.get('/', itemController.getAll);

/**
 * @openapi
 * /items:
 *   post:
 *     tags:
 *       - Items
 *     summary: Crea un nuevo item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemInput'
 *     responses:
 *       '201':
 *         description: El item fue creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       '400':
 *         description: Datos de entrada inválidos.
 */
itemRouter.post('/', itemController.create);

/**
 * @openapi
 * /items/{id}:
 *   get:
 *     tags:
 *       - Items
 *     summary: Obtiene un item por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: El ID del item
 *     responses:
 *       '200':
 *         description: Detalles del item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       '404':
 *         description: El item no fue encontrado.
 */
itemRouter.get('/:id', itemController.getById);

/**
 * @openapi
 * /items/{id}:
 *   put:
 *     tags:
 *       - Items
 *     summary: Actualiza un item existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: El ID del item a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemInput'
 *     responses:
 *       '200':
 *         description: El item fue actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       '400':
 *         description: Datos de entrada inválidos.
 *       '404':
 *         description: El item no fue encontrado.
 */
itemRouter.put('/:id', itemController.update);

/**
 * @openapi
 * /items/{id}:
 *   delete:
 *     tags:
 *       - Items
 *     summary: Elimina un item por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: El ID del item a eliminar
 *     responses:
 *       '204':
 *         description: Item eliminado exitosamente (sin contenido).
 *       '404':
 *         description: El item no fue encontrado.
 */
itemRouter.delete('/:id', itemController.delete);

export default itemRouter;
