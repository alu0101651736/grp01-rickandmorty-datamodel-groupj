import { RepositorioBase } from "./RepositorioBase";
import { IDuplicable } from "./interfaces";
import { Invento } from "./inventos";
import { tiposInvento } from "./types";

export class RepositorioInventos extends RepositorioBase<Invento> implements IDuplicable<Invento> {

  constructor(private normalize: (s: string) => string) {
    super();
  }

  override add(invento: Invento): void {
    if (this.isDuplicate(invento)) {
      throw new Error("Invento duplicado");
    }
    super.add(invento);
  }

  update(id: string, cambios: { nombre?: string; inventor?: string | null; tipo?: tiposInvento; 
                                nivelPeligro?: number; descripcion?: string }): void {

    const invento = this.findById(id);
    if (!invento) throw new Error("El invento no existe");
    const copia = { ...invento };

    if (cambios.nombre !== undefined) {
      if (cambios.nombre.trim() === "") throw new Error("El nombre no puede estar vacío");
      copia.nombre = cambios.nombre;
    }

    if (cambios.inventor !== undefined) {
      if (cambios.inventor === null) throw new Error("El invento debe tener un inventor");
      copia.inventor = cambios.inventor;
    }

    if (cambios.tipo !== undefined)copia.tipo = cambios.tipo;

    if (cambios.nivelPeligro !== undefined)
      if (cambios.nivelPeligro < 1 || cambios.nivelPeligro > 10) throw new Error("El nivel de peligro debe estar entre 1 y 10");

    if (cambios.descripcion !== undefined) 
      if (cambios.descripcion.trim() === "") throw new Error("La descripción no puede estar vacía");

    const duplicado = this.objetos.some(i =>
      i.id !== id &&
      this.normalize(i.nombre) === this.normalize(copia.nombre) &&
      i.tipo === copia.tipo &&
      i.inventor === copia.inventor
    );

    if (duplicado) throw new Error("Invento duplicado");

    if (cambios.nombre !== undefined) invento.nombre = cambios.nombre;
    if (cambios.inventor !== undefined) invento.inventor = cambios.inventor;
    if (cambios.tipo !== undefined) invento.tipo = cambios.tipo;
    if (cambios.nivelPeligro !== undefined) invento.nivelPeligro = cambios.nivelPeligro;
    if (cambios.descripcion !== undefined) invento.descripcion = cambios.descripcion;
  }

  filterByNombre(nombre: string): Invento[] {
    return this.objetos.filter(i => i.nombre === nombre);
  } 
  
  filterByTipo(tipo: tiposInvento): Invento[] {
    return this.objetos.filter(i => i.tipo === tipo);
  }

  filterByInventor(inventor: string): Invento[] {
    return this.objetos.filter(i => i.inventor === inventor);
  }

  filterByPeligrosidad(peligro: number): Invento[] {
    return this.objetos.filter(i => i.nivelPeligro === peligro);
  }  

  setNullInventor(id: string) {
    this.objetos.forEach(i => {
      if (i.inventor === id) i.inventor = null;
    });
  }

  isDuplicate(other: Invento): boolean { 
    return this.objetos.some(i => 
      this.normalize(i.nombre) === this.normalize(other.nombre) &&
      i.tipo === other.tipo &&
      i.inventor === other.inventor
    );
  }
}