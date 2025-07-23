import { ItemRepository } from '../../domain/repositories/item.repository.interface';
import { NotFoundError } from '../errors/not-found.error';
import { ValidationError } from '../errors/validation.error';

/**
 * @class DeleteItemUseCase
 * @description Representa el caso de uso para eliminar un item existente.
 */
export class DeleteItemUseCase {
  private readonly itemRepository: ItemRepository;

  /**
   * Crea una instancia de DeleteItemUseCase.
   * @param {ItemRepository} itemRepository - El repositorio de items.
   */
  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  /**
   * Ejecuta el caso de uso para eliminar un item.
   * @param {string} id - El identificador único del item a eliminar.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la operación se ha completado.
   * @throws {ValidationError} Lanza un error si el formato del ID es inválido.
   * @throws {NotFoundError} Lanza un error si el item no se encuentra.
   */
  async execute(id: string): Promise<void> {
    // 1. Validar formato de entrada
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      throw new ValidationError('El ID proporcionado no tiene un formato UUID válido.');
    }
    
    // 2. Llamar al repositorio
    const wasDeleted = await this.itemRepository.deleteById(id);

    // 3. Validar si el item existía
    if (!wasDeleted) {
      throw new NotFoundError(`El item con ID "${id}" no fue encontrado.`);
    }
  }
}