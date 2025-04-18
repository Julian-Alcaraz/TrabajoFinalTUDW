import { Marco } from './marco.model';

export class Especialidad {
  constructor(
    public id: number,
    public nombre: string,
    public deshabilitado: boolean,
    public marcos?: Marco[],
  ) {}

  static overload_constructor() {
    return new Especialidad(0, '', false);
  }
  [key: string]: any;
}
