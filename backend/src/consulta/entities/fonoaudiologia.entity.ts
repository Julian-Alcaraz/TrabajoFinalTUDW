import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Consulta } from './consulta.entity';

@Entity()
export class Fonoaudiologia {
  // esto lo hago para usar el id de la consulta como primaria y foranea
  @PrimaryGeneratedColumn({ type: 'int' })
  consultaId: number;

  @OneToOne(() => Consulta)
  @JoinColumn()
  consulta: Consulta;

  // datos de fonoaudiologia
  @Column()
  detalleFonudiologia: string; // Propiedad específica de ClinicaGeneral
}
