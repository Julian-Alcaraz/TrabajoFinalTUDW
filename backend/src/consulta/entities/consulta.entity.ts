import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Clinica } from './clinica.entity';
import { Fonoaudiologia } from './fonoaudiologia.entity';
import { Odontologia } from './odontologia.entity';
import { Oftalmologia } from './oftalmologia.entity';
import { Chico } from '../../chico/entities/chico.entity';
import { Institucion } from '../../institucion/entities/institucion.entity';
import { Curso } from '../../curso/entities/curso.entity';

export type ConsultaType = 'Clinica' | 'Fonoaudiologia' | 'Oftalmologia' | 'Odontologia';
export type TurnoType = 'Mañana' | 'Tarde' | 'Noche';
export type DerivacionesType = { /*'Clinica' | */ Odontologia: boolean; Oftalmologia: boolean; Fonoaudiologia: boolean; Externa: boolean };

@Entity('Consulta')
export class Consulta extends EntidadBasica {
  @Column({ type: 'enum', enum: ['Clinica', 'Fonoaudiologia', 'Oftalmologia', 'Odontologia'], nullable: true })
  type: ConsultaType;

  @Column({ type: 'enum', enum: ['Mañana', 'Tarde', 'Noche'], nullable: true })
  turno: TurnoType;

  @Column({ type: 'boolean', nullable: true })
  obra_social: boolean;

  @Column({ type: 'int', nullable: false })
  edad: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'simple-json' })
  derivaciones: {
    //Clinica: boolean;
    Odontologia: boolean
    Oftalmologia: boolean;
    Fonoaudiologia: boolean;
    Externa: boolean;
  };

  // Relaciones

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Chico, (chico) => chico.consultas)
  @JoinColumn({ name: 'id_chico' })
  chico: Chico;

  @ManyToOne(() => Institucion)
  @JoinColumn({ name: 'id_institucion' })
  institucion: Institucion;

  @ManyToOne(() => Curso)
  @JoinColumn({ name: 'id_curso' })
  curso: Curso;

  @OneToOne(() => Clinica)
  clinica: Clinica;

  @OneToOne(() => Fonoaudiologia)
  fonoaudiologia: Fonoaudiologia;

  @OneToOne(() => Odontologia)
  odontologia: Odontologia;

  @OneToOne(() => Oftalmologia)
  oftalmologia: Oftalmologia;
}
