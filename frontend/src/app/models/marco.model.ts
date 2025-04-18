import { Especialidad } from './especialidad.model';
import { Taller } from './taller.model';

export class Marco {
  constructor(
    public id: number,
    public nombre: string,
    public deshabilitado: boolean,
    public especialidad?: Especialidad,
    public talleres?: Taller[],
  ) {}

  static overload_constructor() {
    return new Marco(0, '', false);
  }
  [key: string]: any;
}
