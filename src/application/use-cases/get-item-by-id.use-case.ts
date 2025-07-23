import { Item } from '../../domain/entities/item.entity';
import { ItemRepository } from '../../domain/repositories/item.repository.interface';
import { NotFoundError } from '../errors/not-found.error';
import { ValidationError } from '../errors/validation.error';

/**
 * @class GetItemByIdUseCase
 * @description Representa el caso de uso para obtener un único item por su ID.
 */
export class GetItemByIdUseCase {
  private readonly itemRepository: ItemRepository;

  /**
   * Crea una instancia de GetItemByIdUseCase.
   * @param {ItemRepository} itemRepository - El repositorio de items que se usará para la obtención de datos.
   */
  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  /**
   * Ejecuta el caso de uso para encontrar un item por su ID.
   * @param {string} id - El identificador único del item a obtener.
   * @returns {Promise<Item>} Una promesa que se resuelve con el item encontrado.
   * @throws {ValidationError} Lanza un error si el formato del ID es inválido.
   * @throws {NotFoundError} Lanza un error si no se encuentra ningún item con el ID especificado.
   */
  async execute(id: string): Promise<Item> {
    // 1. Validar el formato del ID antes de consultar la base de datos.
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      throw new ValidationError('El ID proporcionado no tiene un formato UUID válido.');
    }

    // 2. Llamar al repositorio para encontrar el item.
    const item = await this.itemRepository.findById(id);

    // 3. Validar si el item fue encontrado.
    if (!item) {
      throw new NotFoundError(`El item con ID "${id}" no fue encontrado.`);
    }

    // 4. Devolver el item encontrado.
    return item;
  }
}