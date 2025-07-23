import { Item } from '../../domain/entities/item.entity';
import { ItemRepository } from '../../domain/repositories/item.repository.interface';
import { NotFoundError } from '../errors/not-found.error';
import { ValidationError } from '../errors/validation.error';

/**
 * @class UpdateItemUseCase
 * @description Representa el caso de uso para actualizar un item existente.
 */
export class UpdateItemUseCase {
  private readonly itemRepository: ItemRepository;

  /**
   * Crea una instancia de UpdateItemUseCase.
   * @param {ItemRepository} itemRepository - El repositorio de items.
   */
  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  /**
   * Ejecuta el caso de uso para actualizar los datos de un item.
   * @param {string} id - El ID único del item a actualizar.
   * @param {object} data - Un objeto que contiene los campos a actualizar.
   * @returns {Promise<Item>} Una promesa que se resuelve con el item actualizado.
   * @throws {ValidationError} Lanza un error si los datos o el formato del ID son inválidos.
   * @throws {NotFoundError} Lanza un error si el item no se encuentra.
   */
  async execute(id: string, data: { name?: string; price?: number }): Promise<Item> {
    // 1. Validar formato de entrada
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      throw new ValidationError('El ID proporcionado no tiene un formato UUID válido.');
    }
    if (data.name !== undefined && data.name.trim() === '') {
      throw new ValidationError('El nombre del item no puede estar vacío.');
    }
    if (data.price !== undefined) {
      if (typeof data.price !== 'number' || isNaN(data.price)) {
        throw new ValidationError('El precio debe ser un número válido.');
      }
      if (data.price < 0) {
        throw new ValidationError('El precio del item no puede ser negativo.');
      }
    }
    
    // 2. Llamar al repositorio
    const updatedItem = await this.itemRepository.update(id, data);

    // 3. Validar si el item existía
    if (!updatedItem) {
      throw new NotFoundError(`El item con ID "${id}" no fue encontrado.`);
    }

    // 4. Devolver el resultado
    return updatedItem;
  }
}