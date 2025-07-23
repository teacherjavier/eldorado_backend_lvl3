import { Item } from '../../domain/entities/item.entity';
import { ItemRepository } from '../../domain/repositories/item.repository.interface';
import { ValidationError } from '../errors/validation.error';

/**
 * @class CreateItemUseCase
 * @description Representa el caso de uso para crear un nuevo item. Orquesta la lógica de negocio
 * e interactúa con el repositorio para persistir los datos.
 */
export class CreateItemUseCase {
  /**
   * El repositorio para las operaciones de datos de los items.
   * @private
   * @readonly
   * @type {ItemRepository}
   */
  private readonly itemRepository: ItemRepository;

  /**
   * Crea una instancia de CreateItemUseCase.
   * @param {ItemRepository} itemRepository - El repositorio de items que se usará para la persistencia de datos.
   * Esta dependencia se inyecta para seguir el Principio de Inversión de Dependencias.
   */
  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  /**
   * Ejecuta el caso de uso para crear un nuevo item.
   *
   * @param {object} input - Los datos de entrada para crear el item.
   * @param {string} input.name - El nombre del nuevo item.
   * @param {number} input.price - El precio del nuevo item.
   * @returns {Promise<Item>} Una promesa que se resuelve con el item recién creado.
   * @throws {ValidationError} Lanza un error de validación si los datos de entrada son inválidos.
   */
  async execute(input: { name: string; price: number }): Promise<Item> {
    const { name, price } = input;

    if (typeof price !== 'number' || isNaN(price)) {
      throw new ValidationError('El precio debe ser un número válido.');
    }

    // 1. Validar los datos de entrada.
    if (!name || name.trim() === '') {
      // Usamos nuestra clase de error personalizada para errores de validación.
      throw new ValidationError('El nombre del item no puede estar vacío.');
    }

    if (price === undefined || price === null || price < 0) {
      // Usamos nuestra clase de error personalizada para errores de validación.
      throw new ValidationError('El precio del item no puede ser negativo.');
    }

    // 2. Llamar al repositorio para crear el item.
    const newItem = await this.itemRepository.create({ name, price });

    // 3. Devolver el item creado.
    return newItem;
  }
}