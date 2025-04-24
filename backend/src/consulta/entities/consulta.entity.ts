import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Clinica } from './clinica.entity';
import { Fonoaudiologia } from './fonoaudiologia.entity';
import { Odontologia } from './odontologia.entity';
import { Oftalmologia } from './oftalmologia.entity';
import { Chico } from '../../chico/entities/chico.entity';
import { Institucion } from '../../institucion/entities/institucion.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { ConsultaType, ConsultaEnum, TurnoType, TurnoEnum } from '../../common/const/const';
import { Prevencion } from './prevencion.entity';
import { Social } from './social.entity';

@Entity('consulta')
export class Consulta extends EntidadBasica {
  @Column({ type: 'enum', enum: ConsultaEnum, nullable: true })
  type: ConsultaType;

  @Column({ type: 'enum', enum: TurnoEnum, nullable: true })
  turno: TurnoType;

  @Column({ type: 'boolean', nullable: true })
  obra_social: boolean;

  @Column({ type: 'int', nullable: false })
  edad: number;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  observaciones: string;

  @Column({ type: 'boolean', default: false })
  derivacion_oftalmologia: boolean;

  @Column({ type: 'boolean', default: false })
  derivacion_odontologia: boolean;

  @Column({ type: 'boolean', default: false })
  derivacion_fonoaudiologia: boolean;

  @Column({ type: 'boolean', default: false })
  derivacion_prevencion: boolean;

  @Column({ type: 'boolean', default: false })
  derivacion_social: boolean;

  @Column({ type: 'boolean', default: false })
  derivacion_externa: boolean;

  // Relaciones

  @ManyToOne(() => Usuario, (usuario) => usuario.consultas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Chico, (chico) => chico.consultas)
  @JoinColumn({ name: 'id_chico' })
  chico: Chico;

  @ManyToOne(() => Institucion, (institucion) => institucion.consultas)
  @JoinColumn({ name: 'id_institucion' })
  institucion: Institucion;

  @ManyToOne(() => Curso, (curso) => curso.consultas)
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  // Hijas

  @OneToOne(() => Clinica, (clinica) => clinica.consulta)
  clinica: Clinica;

  @OneToOne(() => Fonoaudiologia, (fonoaudiologia) => fonoaudiologia.consulta)
  fonoaudiologia: Fonoaudiologia;

  @OneToOne(() => Odontologia, (odontologia) => odontologia.consulta)
  odontologia: Odontologia;

  @OneToOne(() => Oftalmologia, (oftalmologia) => oftalmologia.consulta)
  oftalmologia: Oftalmologia;

  @OneToOne(() => Prevencion, (prevencion) => prevencion.consulta)
  prevencion: Prevencion;

  @OneToOne(() => Social, (social) => social.consulta)
  social: Social;
}
