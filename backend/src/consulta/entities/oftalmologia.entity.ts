import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Consulta } from './consulta.entity';

@Entity()
export class Oftalmologia {
  @PrimaryGeneratedColumn({ type: 'int' })
  consultaId: number;

  @OneToOne(() => Consulta)
  @JoinColumn()
  consulta: Consulta;

  // datos clinica general
  @Column()
  detalleClinico: string; // Propiedad específica de ClinicaGeneral
}
