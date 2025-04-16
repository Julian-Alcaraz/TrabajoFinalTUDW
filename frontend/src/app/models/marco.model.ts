import { Especialidad } from './especialidad.model';
import { Taller } from './taller.model';

export class Marco {
  constructor(
    public id: number,
    public nombre: string,
    public especialidad?: Especialidad,
    public talleres?: Taller[],
  ) {}

  static overload_constructor() {
    return new Marco(0, '');
  }
  [key: string]: any;
}
