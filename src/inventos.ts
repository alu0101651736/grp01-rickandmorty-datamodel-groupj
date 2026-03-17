import { IInvento } from "./interfaces";
import { tiposInvento } from "./types";

export class Invento implements IInvento {
    constructor(
        public readonly id: string,
        public nombre: string,
        public inventor: string,
        public tipo: tiposInvento,
        public nivelPeligro: number,
        public descripcion: string
    ) {
        
    }
}