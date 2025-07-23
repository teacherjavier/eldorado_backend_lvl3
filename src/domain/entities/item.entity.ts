/**
 * Representa la entidad de dominio principal para un Item en el sistema.
 *
 * Esta clase es un objeto de datos plano (POJO), puro y sin dependencias de
 * frameworks o librerías externas. Encapsula las propiedades esenciales
 * y las reglas de negocio que constituyen un "Item".
 */
export class Item {
  /**
   * El identificador único para el item.
   * Se recomienda usar un formato estándar como UUID.
   * @public
   * @type {string}
   */
  public id: string;

  /**
   * El nombre de visualización del item.
   * @public
   * @type {string}
   */
  public name: string;

  /**
   * El precio del item. La lógica de negocio debe asegurar
   * que este valor no sea negativo.
   * @public
   * @type {number}
   */
  public price: number;

  /**
   * Crea una instancia de un Item.
   * @param {string} id - El identificador único para el item.
   * @param {string} name - El nombre del item.
   * @param {number} price - El precio del item.
   */
  constructor(id: string, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}