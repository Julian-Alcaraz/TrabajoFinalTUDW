import { Consulta } from './consulta.model';

import { NivelCursoType } from '@app/common/const/const';

export class Curso {
  constructor(
    public id: number,
    public nombre: string,
    public nivel: NivelCursoType,
    public deshabilitado: boolean,
    public consultas?: Consulta[],
  ) {}

  static overload_constructor() {
    return new Curso(0, '', 'Jardin', false);
  }
  [key: string]: any;
}
