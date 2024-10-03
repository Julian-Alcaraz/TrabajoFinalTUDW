import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Consulta } from './consulta.entity';

@Entity()
export class ClinicaGeneral {
  // esto lo hago para usar el id de la consulta como primaria y foranea
  @PrimaryGeneratedColumn({ type: 'int' })
  consultaId: number;

  @OneToOne(() => Consulta)
  @JoinColumn()
  consulta: Consulta;

  // datos clinica general
  @Column()
  detalleClinico: string; // Propiedad específica de ClinicaGeneral
}
