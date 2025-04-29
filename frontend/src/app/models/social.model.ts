export class Social {
  constructor(
    public id: number,
    public demanda: string,
    public articulacion: string,
    public objeto_informe: string,
    public seguimiento: string,
  ) {}

  static overload_constructor() {
    return new Social(0, '', '', '', '');
  }
}
