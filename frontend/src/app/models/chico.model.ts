export type Sexo = 'Femenino' | 'Masculino' | 'Otro';

export class Chico {
  constructor(
    public id: number,
    public dni: number,
    public nombre: string,
    public apellido: string,
    public sexo: Sexo,
    public telefono: number,
    public direccion: string,
    public nombre_padre: string,
    public nombre_madre: string,
    public deshabilitado?: boolean,
    public fe_nacimiento?: Date,
  ) {}

  static overload_constructor() {
    return new Chico(0, 0, '', '', 'Otro', 0, '', '', '');
  }
}
