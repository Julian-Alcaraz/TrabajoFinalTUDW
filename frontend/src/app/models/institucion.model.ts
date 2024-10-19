export type TiposInstitucion = 'Jardin' | 'Primario' | 'Secundario'| 'Terciario';

export class Institucion {
  constructor(
    public id: number,
    public nombre: string,
    public tipo: TiposInstitucion,
    //public consultas?: Consulta[]
  ) {}

  static overload_constructor() {
    return new Institucion(0, '', 'Jardin');
  }
}
