export type NivelCurso = 'Jardin'| 'Primario'| 'Secundario';

export class Curso {
  constructor(
    public id: number,
    public nombre: string,
    public nivel: NivelCurso,
    //public consultas?: Consulta[]
  ) {}

  static overload_constructor() {
    return new Curso(0, '', 'Jardin');
  }
}
