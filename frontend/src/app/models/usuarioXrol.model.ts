export class RolXusuario {
  constructor(
    public id_usuario: number,
    public id_rol: number,
  ) {}

  static overload_constructor() {
    return new RolXusuario(0, 0);
  }
}
