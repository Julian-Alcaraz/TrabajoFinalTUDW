import { Especialidad } from './especialidad.model';
import { Institucion } from './institucion.model';
import { Curso } from './curso.model';
import { Marco } from './marco.model';

import { DuracionType, DestinatariosType, TurnoTalleresType, ConjuntoConType, FrecuenciaType } from '@app/common/const/const';

export class Taller {
  constructor(
    public id: number,
    public nombre: string,
    public fecha: Date,
    public cant_encuentros: number,
    public duracion: DuracionType,
    public cant_participantes: number,
    public destinatarios: DestinatariosType,
    public recursos: string,
    public turno: TurnoTalleresType,
    public conjuntoCon: ConjuntoConType,
    public frecuencia: FrecuenciaType,
    public es_taller: boolean,
    public deshabilitado: boolean,
    public entrega_cepillos: boolean,
    public observaciones?: string,
    public especialidad?: Especialidad,
    public institucion?: Institucion,
    public curso?: Curso,
    public marco?: Marco,
  ) {}

  static overload_constructor() {
    return new Taller(0, '', new Date(), 1, 1, 1, 'PSA', '', 'Mañana', 'Odontologia', 'Semanal', false, false, false);
  }
  [key: string]: any; // Esto permite el acceso dinámico
}
