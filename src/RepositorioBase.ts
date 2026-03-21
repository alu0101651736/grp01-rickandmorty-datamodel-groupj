import { IRepositorio } from "./interfaces";

/**
 * Clase abstracta que define un repositorio genérico para gestionar colecciones de objetos.
 * 
 * Implementa operaciones básicas de inserción, eliminación y búsqueda por id.
 * 
 * @template T - Tipo de los elementos almacenados en el repositorio. Debe tener una propiedad `id` de tipo string.
 */
export abstract class RepositorioBase<T extends { id: string }> implements IRepositorio<T> {
  protected objetos: T[] = [];

  add(item: T): void {
    if (typeof this.findById(item.id) !== "undefined") throw new Error("ID duplicado");
    this.objetos.push(item);
  }

  remove(id: string): void {
    if (typeof this.findById(id) === "undefined") throw new Error("El elemento no existe");
    this.objetos = this.objetos.filter(i => i.id !== id);
  }

  findById(id: string): T | undefined {
    return this.objetos.find(i => i.id === id);
  }

  getAll(): T[] {
    return this.objetos;
  } 
}