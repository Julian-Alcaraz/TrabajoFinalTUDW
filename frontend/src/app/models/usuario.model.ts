import { Rol } from './rol.model';

export class Usuario {
  constructor(
    public id: number,
    public dni: number,
    public nombre: string,
    public apellido: string,
    public email: string,
    public deshabilitado: boolean,
    public roles_ids?: number[],
    public contrasenia?: string,
    public fe_nacimiento?: Date,
    public cambioContrasenia?: boolean,
    public roles?: Rol[], // esto es opcional podria  no estar
  ) {}

  static overload_constructor() {
    return new Usuario(0, 0, '', '', '', false, [], '', undefined);
  }
  [key: string]: any; // Esto permite el acceso dinámico
}
