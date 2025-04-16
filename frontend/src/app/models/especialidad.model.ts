import { Marco } from './marco.model';

export class Especialidad {
  constructor(
    public id: number,
    public nombre: string,
    public marcos?: Marco[],
  ) {}

  static overload_constructor() {
    return new Especialidad(0, '');
  }
  [key: string]: any;
}
