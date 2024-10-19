export type NivelCurso = 'Primaria' | 'Secundario' | 'Jardin'| 'Terciario' | 'Universitario';

export class Curso {
  constructor(
    public id: number,
    public nombre: string,
    public grado: number,
    public nivel: NivelCurso,
    //public consultas?: Consulta[]
  ) {}

  static overload_constructor() {
    return new Curso(0, '', 0, 'Primaria');
  }
}
