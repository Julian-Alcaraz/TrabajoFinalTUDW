import { Categoria } from "./categoria.model";

export class Social {
  constructor(
    public id: number,
    public demanda: string,
    public articulacion: string,
    public objeto_informe: string,
    public seguimiento: string,
    public categorias?: Categoria[]
  ) {}

  static overload_constructor() {
    return new Social(0, '', '', '', '');
  }
}
