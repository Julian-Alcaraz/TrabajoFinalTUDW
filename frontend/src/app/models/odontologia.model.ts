export class Odontologia {
  constructor(
    public id: number,
    public primera_vez: boolean,
    public ulterior: boolean,
    public dientes_permanentes: number,
    public dientes_temporales: number,
    public sellador: number,
    public topificacion: boolean,
    public cepillado: boolean,
    // public derivacion: boolean,
    public dientes_recuperables: number,
    public dientes_irecuperables: number,
    public cepillo: boolean,
    public habitos: string,
    public clasificacion?: string,
    // public situacion_bucal: string,
  ) {}

  static overload_constructor() {
    return new Odontologia(0, false, false, 0, 0, 0, false, false, 0, 0, false, '', '');
  }
}
