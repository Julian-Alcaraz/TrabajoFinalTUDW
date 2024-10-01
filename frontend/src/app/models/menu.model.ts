export class Menu {
  constructor(
    public id: number,
    public deshabilitado: boolean,
    public url: string,
    public label: string,
    public sub_menus?: Menu[],
    public id_padre?: number | undefined,
    public icon?: string,
    public created_at?: Date,
    public updated_at?: Date,
    public expanded?: boolean,
    public orden?: number,
  ) {}

  static overload_constructor() {
    return new Menu(0, false, '', '', [], undefined, undefined);
  }
}
