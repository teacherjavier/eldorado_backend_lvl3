import { Item } from '../../domain/entities/item.entity';
import { ItemRepository } from '../../domain/repositories/item.repository.interface';

/**
 * @class GetAllItemsUseCase
 * @description Representa el caso de uso para obtener todos los items existentes.
 * Este caso de uso es directo y actúa como un intermediario hacia la capa del repositorio.
 */
export class GetAllItemsUseCase {
  /**
   * El repositorio para las operaciones de datos de los items.
   * @private
   * @readonly
   * @type {ItemRepository}
   */
  private readonly itemRepository: ItemRepository;

  /**
   * Crea una instancia de GetAllItemsUseCase.
   * @param {ItemRepository} itemRepository - El repositorio de items que se usará para la obtención de datos.
   */
  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  /**
   * Ejecuta el caso de uso para obtener todos los items.
   *
   * @returns {Promise<Item[]>} Una promesa que se resuelve con un array de todos los items.
   * El array estará vacío si no se encuentran items.
   */
  async execute(): Promise<Item[]> {
    // 1. Llamar al repositorio para encontrar todos los items.
    const items = await this.itemRepository.findAll();

    // 2. Devolver el array de items.
    return items;
  }
}