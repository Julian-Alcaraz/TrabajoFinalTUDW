import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ClinicaGeneral } from './clinica.entity';
import { Fonoaudiologia } from './fonoaudiologia.entity';
import { Odontologia } from './odontologia.entity';
import { Oftalmologia } from './oftalmologia.entity';
import { Chico } from '../../chico/entities/chico.entity';
import { Institucion } from '../../institucion/entities/institucion.entity';
import { Curso } from '../../curso/entities/curso.entity';

export type consultaType = 'Clinica' | 'Fonoaudiologia' | 'Oftalmologia' | 'Odontologia';

@Entity()
export class Consulta extends EntidadBasica {
  @Column({ type: 'enum', enum: ['Clinica', 'Fonoaudiologia', 'Oftalmologia', 'Odontologia'], /*length: 100,*/ nullable: true })
  type: consultaType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  obra_social: string;

  @Column({ type: 'int', nullable: false })
  edad: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  // Relaciones

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  usuario: Usuario;

  @ManyToOne(() => Chico, (chico) => chico.consultas)
  chico: Chico;

  @ManyToOne(() => Institucion)
  @JoinColumn()
  institucion: Institucion;

  @ManyToOne(() => Curso)
  @JoinColumn()
  curso: Curso;

  @OneToOne(() => ClinicaGeneral)
  clinicaGeneral: ClinicaGeneral;

  @OneToOne(() => Fonoaudiologia)
  fonoaudiologia: Fonoaudiologia;

  @OneToOne(() => Odontologia)
  odontologia: Odontologia;

  @OneToOne(() => Oftalmologia)
  oftalmologia: Oftalmologia;
}
