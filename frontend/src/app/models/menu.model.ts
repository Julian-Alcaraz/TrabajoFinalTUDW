export class Menu {
  constructor(
    public id: number,
    public id_padre: string,
    public path: string, //agregar a la bd
    public nombre: string, //agregar a la bd
    public descripcion: string,
  ) {}

  static overload_constructor() {
    return new Menu(0, '', '', '', '');
  }
}
