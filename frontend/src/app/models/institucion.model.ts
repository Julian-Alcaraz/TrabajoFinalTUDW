import { Consulta } from './consulta.model';

export type TiposInstitucion = 'Jardin' | 'Primario' | 'Secundario';

export class Institucion {
  constructor(
    public id: number,
    public nombre: string,
    public tipo: TiposInstitucion,
    public deshabilitado: boolean,
    public consultas?: Consulta[],
  ) {}

  static overload_constructor() {
    return new Institucion(0, '', 'Jardin', false);
  }
  [key: string]: any;
}
