import { Item } from '../entities/item.entity';

/**
 * @interface ItemRepository
 * @description Define el contrato (puerto) para las operaciones de persistencia de datos relacionadas con la entidad Item.
 * Esta interfaz es parte de la capa de dominio y abstrae el mecanismo de almacenamiento de datos subyacente,
 * permitiendo diferentes implementaciones (ej: PostgreSQL, MongoDB, en memoria) sin
 * cambiar la lógica principal de la aplicación.
 */
export interface ItemRepository {
  /**
   * Crea un nuevo item en el almacén de datos.
   * @param {Omit<Item, 'id'>} itemData - Los datos del nuevo item, excluyendo el ID.
   * @returns {Promise<Item>} Una promesa que se resuelve con el item recién creado, incluyendo su ID generado.
   */
  create(itemData: Omit<Item, 'id'>): Promise<Item>;

  /**
   * Encuentra un único item por su identificador único.
   * @param {string} id - El ID único del item a encontrar.
   * @returns {Promise<Item | null>} Una promesa que se resuelve con el item encontrado, o null si no existe ningún item con el ID proporcionado.
   */
  findById(id: string): Promise<Item | null>;

  /**
   * Obtiene todos los items del almacén de datos.
   * @returns {Promise<Item[]>} Una promesa que se resuelve con un array de todos los items. El array estará vacío si no existen items.
   */
  findAll(): Promise<Item[]>;

  /**
   * Actualiza los datos de un item existente.
   * @param {string} id - El ID único del item a actualizar.
   * @param {Partial<Omit<Item, 'id'>>} itemData - Un objeto que contiene los campos a actualizar.
   * @returns {Promise<Item | null>} Una promesa que se resuelve con el item actualizado, o null si no se encontró ningún item con el ID proporcionado.
   */
  update(id: string, itemData: Partial<Omit<Item, 'id'>>): Promise<Item | null>;

  /**
   * Elimina un item por su identificador único.
   * @param {string} id - El ID único del item a eliminar.
   * @returns {Promise<boolean>} Una promesa que se resuelve a true si el item fue eliminado con éxito, o false si el item no fue encontrado.
   */
  deleteById(id: string): Promise<boolean>;
}