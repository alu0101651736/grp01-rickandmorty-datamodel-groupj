import { estadosDimension, tiposEspecie, tiposInvento } from "./types";



/**
 * Interfaz que define los atributos comunes de los objetos en el sistema.
 */
export interface IAtributos {
  /** ID unico del objeto */
  id: string;

  /** Nombre del objeto */
  nombre: string;
}

/**
 * Interfaz que define los atributos específicos de una __dimensión__ en el sistema.
 */
export interface IDimension extends IAtributos {
  /** Estado actual de la dimension */
  estadoDim: estadosDimension;

  /** Nivel tecnologico de la dimension, esta entre 1 y 10 */
  nivelTec: number;

  /** Descripcion adicional de la dimension */
  descripcion: string;
}


/**
 * Interfaz que define los atriutos de las __especies__ en el sistema.
 */
export interface IEspecie extends IAtributos {
  /** Origen de la especie - referencia al planeta o dimensión de la especie */
  origen: string;
  /** Tipo de especie*/
  tipo: tiposEspecie;
  /** Esperanza de vida de la especie */
  esperanzaVida: number;
  /** Descripcion adicional de la especie */
  descripcion: string;
}

/**
 * Interfaz que define los atributos de los __inventos__ en el sistema.
 */
export interface IInvento extends IAtributos {
  /** Nombre del inventor del invento - referencia al personaje */
  inventor: string;
  /** Tipo de invento */
  tipo: tiposInvento;
  /** Nivel de peligro del invento, esta entre 1 y 10 */
  nivelPeligro: number;
  /** Descripcion adicional del invento */
  descripcion: string;
}
 

