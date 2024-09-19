export class Menu {
  constructor(
    public id: number,
    public deshabilitado: boolean,
    public url: string,
    public label: string,
    public sub_menu?: Menu[],
    public id_padre?: number | undefined,
    public icon?: string,
    public created_at?: Date,
    public update?: Date,
    public expanded?: boolean,
  ) {}

  static overload_constructor() {
    return new Menu(0, false, '', '', [], undefined, undefined);
  }
}
