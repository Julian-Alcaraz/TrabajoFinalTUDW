import { Oftalmologia } from './oftalmologia.model';
import { Clinica } from './clinica.model';
import { Fonoaudiologia } from './fonoaudiologia.model';
import { Odontologia } from './odontologia.model';
import { Chico } from './chico.model';
import { Institucion } from './institucion.model';
import { Curso } from './curso.model';
import { Usuario } from './usuario.model';

export type Type = 'Clinica' | 'Fonoaudiologia' | 'Oftalmologia' | 'Odontologia';
export type Turno = 'Mañana' | 'Tarde' | 'Noche';

export class Consulta {
  constructor(
    public id: number,
    public created_at: Date,
    public updated_at: Date,
    public deshabilitado: boolean,
    public type: Type,
    public turno: Turno,
    public edad: number,
    public id_chico: number,
    public id_institucion: number,
    public odontologia?: Odontologia,
    public oftalmologia?: Oftalmologia,
    public fonoaudiologia?: Fonoaudiologia,
    public clinica?: Clinica,
    public chico?: Chico,
    public institucion?: Institucion,
    public usuario?: Usuario,
    public curso?: Curso,
    public observaciones?: string,
    public obra_social?: string,
    public derivaciones?: any,
    // {externa:boolean,clinica:boolean}
  ) {}

  static overload_constructor() {
    return new Consulta(0, new Date(), new Date(), false, 'Clinica', 'Mañana', 0, 0, 0);
  }
}
