import { Oftalmologia } from './oftalmologia.model';
import { Clinica } from './clinica.model';
import { Fonoaudiologia } from './fonoaudiologia.model';
import { Odontologia } from './odontologia.model';

export type Type = 'Clinica' | 'Fonoaudiologia' | 'Oftalmologia' | 'Odontologia';
export type Turno = 'Mañana' | 'Tarde' | 'Noche';

export class Consulta {
  constructor(
    public id: number,
    public type: Type,
    public turno: Turno,
    public edad: number,
    public id_chico: number,
    public id_institucion: number,
    public odontologia?: Odontologia,
    public oftalmologia?: Oftalmologia,
    public fonoaudiologia?: Fonoaudiologia,
    public clinica?: Clinica,
    public observaciones?: string,
    public obra_social?: string,
  ) {}

  static overload_constructor() {
    return new Consulta(0, 'Clinica', 'Mañana', 0, 0, 0);
  }
}
