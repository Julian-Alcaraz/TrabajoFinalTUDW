import { Chico } from './chico.model';
import { Localidad } from './localidad.model';

export class Barrio {
  constructor(
    public id: number,
    public id_localidad: number,
    public nombre: string,
    public deshabilitado: boolean,
    public localidad?: Localidad,
    public chicos?: Chico[],
  ) {}

  static overload_constructor() {
    return new Barrio(0, 0, '', false);
  }
  [key: string]: any;
}
