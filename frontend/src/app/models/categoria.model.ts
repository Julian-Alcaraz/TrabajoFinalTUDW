export class Categoria {
  constructor(
    public id: number,
    public nombre: string,
  ) {}

  static overload_constructor() {
    return new Categoria(0, '');
  }
  [key: string]: any;
}
