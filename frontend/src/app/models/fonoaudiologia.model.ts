export class Fonoaudiologia {
  constructor(
    public id: number,
    public asistencia: boolean,
    public diagnostico_presuntivo: string,
    public causas: string,
  ) {}

  static overload_constructor() {
    return new Fonoaudiologia(0, false, '', '');
  }
}
