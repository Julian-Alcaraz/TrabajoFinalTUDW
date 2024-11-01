import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Consulta } from './consulta.entity';

@Entity()
export class Odontologia {
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  @OneToOne(() => Consulta)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;

  // Datos de Odontologia

  @Column({ type: 'boolean' })
  primera_vez: boolean;

  @Column({ type: 'boolean' })
  ulterior: boolean;

  @Column({ type: 'int', nullable: true })
  dientes_permanentes: number;

  @Column({ type: 'int', nullable: true })
  dientes_temporales: number;

  @Column({ type: 'int', nullable: true })
  sellador: number;

  @Column({ type: 'boolean' })
  topificacion: boolean;

  @Column({ type: 'boolean' })
  cepillado: boolean;

  @Column({ type: 'boolean' })
  derivacion: boolean;

  @Column({ type: 'int', nullable: true })
  dientes_recuperables: number;

  @Column({ type: 'int', nullable: true })
  dientes_irecuperables: number;

  @Column({ type: 'boolean' })
  cepillo: boolean;

  @Column({ type: 'varchar', length: 100 })
  habitos: string;

  // @Column({ type: 'varchar', length: 100 })
  // situacion_bucal: string;

  // Clasificación calculada
  @Column({ type: 'varchar', length: 100 })
  clasificacion: string;
}
