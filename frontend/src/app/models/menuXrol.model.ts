export class MenuXrol {
  constructor(
    public id_menu: number,
    public id_rol: number,
  ) {}

  static overload_constructor() {
    return new MenuXrol(0, 0);
  }
}
