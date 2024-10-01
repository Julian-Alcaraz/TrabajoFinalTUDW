export class Rol {
  constructor(
    public id: number,
    public nombre: string,
  ) {}

  static overload_constructor() {
    return new Rol(0, '');
  }
}
