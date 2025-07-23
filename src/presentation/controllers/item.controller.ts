import { Request, Response, NextFunction } from 'express';
import { Logger } from 'pino';
import { CreateItemUseCase } from '../../application/use-cases/create-item.use-case';
import { DeleteItemUseCase } from '../../application/use-cases/delete-item.use-case';
import { GetAllItemsUseCase } from '../../application/use-cases/get-all-items.use-case';
import { GetItemByIdUseCase } from '../../application/use-cases/get-item-by-id.use-case';
import { UpdateItemUseCase } from '../../application/use-cases/update-item.use-case';

/**
 * @class ItemController
 * @description Gestiona las peticiones HTTP entrantes para el endpoint `/items`. Actúa como la capa de presentación,
 * traduciendo las peticiones HTTP en comandos para la capa de aplicación (casos de uso) y
 * formateando los resultados de vuelta en respuestas HTTP.
 */
export class ItemController {
  /**
   * Crea una instancia de ItemController.
   * @param {Logger} logger - El logger de la aplicación.
   * @param {CreateItemUseCase} createItemUseCase - Caso de uso para crear un item.
   * @param {GetAllItemsUseCase} getAllItemsUseCase - Caso de uso para obtener todos los items.
   * @param {GetItemByIdUseCase} getItemByIdUseCase - Caso de uso para obtener un único item.
   * @param {UpdateItemUseCase} updateItemUseCase - Caso de uso para actualizar un item.
   * @param {DeleteItemUseCase} deleteItemUseCase - Caso de uso para eliminar un item.
   */
  constructor(
    private readonly logger: Logger,
    private readonly createItemUseCase: CreateItemUseCase,
    private readonly getAllItemsUseCase: GetAllItemsUseCase,
    private readonly getItemByIdUseCase: GetItemByIdUseCase,
    private readonly updateItemUseCase: UpdateItemUseCase,
    private readonly deleteItemUseCase: DeleteItemUseCase
  ) {}

  /**
   * Gestiona la petición para crear un nuevo item.
   * Corresponde al endpoint `POST /items`.
   * @public
   */
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.logger.info({ body: req.body }, 'Petición recibida para crear un item');
      const newItem = await this.createItemUseCase.execute(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Gestiona la petición para obtener todos los items.
   * Corresponde al endpoint `GET /items`.
   * @public
   */
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.logger.info('Petición recibida para obtener todos los items');
      const items = await this.getAllItemsUseCase.execute();
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Gestiona la petición para obtener un único item por su ID.
   * Corresponde al endpoint `GET /items/:id`.
   * @public
   */
  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      this.logger.info({ id }, 'Petición recibida para obtener un item por ID');
      const item = await this.getItemByIdUseCase.execute(id);
      res.status(200).json(item);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Gestiona la petición para actualizar un item existente.
   * Corresponde al endpoint `PUT /items/:id`.
   * @public
   */
  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      this.logger.info({ id, body: req.body }, 'Petición recibida para actualizar un item');
      const updatedItem = await this.updateItemUseCase.execute(id, req.body);
      res.status(200).json(updatedItem);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Gestiona la petición para eliminar un item.
   * Corresponde al endpoint `DELETE /items/:id`.
   * @public
   */
  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      this.logger.info({ id }, 'Petición recibida para eliminar un item');
      await this.deleteItemUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}