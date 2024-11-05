import { Localidad } from './localidad.model';

export class Barrio {
  constructor(
    public id: number,
    public id_localidad: number,
    public nombre: string,
    public localidad?: Localidad,
  ) {}

  static overload_constructor() {
    return new Barrio(0, 0, '');
  }
}
