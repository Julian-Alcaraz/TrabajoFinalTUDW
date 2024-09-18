export class Rol {
  constructor(
    public id: number,
    public descripcion: string,
  ) {}

  static overload_constructor() {
    return new Rol(0, '');
  }
}
