export class Localidad {
  constructor(
    public id: number,
    public nombre: string,
  ) {}

  static overload_constructor() {
    return new Localidad(0, '');
  }
}
