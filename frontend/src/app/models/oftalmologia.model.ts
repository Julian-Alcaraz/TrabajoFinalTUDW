export type Type = 'Clinica' | 'Fonoaudiologia' | 'Oftalmologia' | 'Odontologia';
export type Turno = 'Mañana' | 'Tarde' | 'Noche';

export class Oftalmologia {
  constructor(
    public id: number,
    public demanda: string,
    public primera_vez: boolean,
    public control: boolean,
    public receta: boolean,
    public anteojos: boolean,
    public prox_control: Date,
  ) {}

  static overload_constructor() {
    return new Oftalmologia(0, '', false, false, false, false, new Date('2000-12-10'));
  }
}
