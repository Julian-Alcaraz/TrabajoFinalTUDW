import { Consulta } from './consulta.model';

import { TipoInstitucionType } from '@app/common/const/const';

export class Institucion {
  constructor(
    public id: number,
    public nombre: string,
    public tipo: TipoInstitucionType,
    public deshabilitado: boolean,
    public consultas?: Consulta[],
  ) {}

  static overload_constructor() {
    return new Institucion(0, '', 'Jardin', false);
  }
  [key: string]: any;
}
