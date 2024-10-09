import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Consulta } from './consulta.entity';

@Entity()
export class ClinicaGeneral {
  // esto lo hago para usar el id de la consulta como primaria y foranea
  @PrimaryColumn({ type: 'int' })
  consultaId: number;

  @OneToOne(() => Consulta)
  @JoinColumn({ name: 'consultaId' })
  consulta: Consulta;

  // datos clinica general
  @Column()
  detalleClinico: string; // Propiedad específica de ClinicaGeneral
}
