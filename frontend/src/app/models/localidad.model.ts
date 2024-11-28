import { Barrio } from "./barrio.model";

export class Localidad {
  constructor(
    public id: number,
    public nombre: string,
    public deshabilitado: boolean,
    public barrios?: Barrio[],
  ) {}

  static overload_constructor() {
    return new Localidad(0, '', false);
  }
  [key: string]: any;
}
