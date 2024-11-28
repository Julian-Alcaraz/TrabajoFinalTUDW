import { Consulta } from './consulta.model';

export type NivelCurso = 'Jardin' | 'Primario' | 'Secundario';

export class Curso {
  constructor(
    public id: number,
    public nombre: string,
    public nivel: NivelCurso,
    public deshabilitado: boolean,
    public consultas?: Consulta[],
  ) {}

  static overload_constructor() {
    return new Curso(0, '', 'Jardin', false);
  }
  [key: string]: any;
}
