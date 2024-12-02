export type Type = 'Clinica' | 'Fonoaudiologia' | 'Oftalmologia' | 'Odontologia';
export type Turno = 'Mañana' | 'Tarde' | 'Noche';
export type Demanda = 'Control niño sano' | 'Docente' | 'Familiar' | 'Otro';

export class Oftalmologia {
  constructor(
    public id: number,
    public demanda: Demanda,
    public primera_vez: boolean,
    public control: boolean,
    public receta: boolean,
    public anteojos: boolean,
    public prox_control: Date,
  ) {}

  static overload_constructor() {
    return new Oftalmologia(0, 'Otro', false, false, false, false, new Date('2000-12-10'));
  }
}
