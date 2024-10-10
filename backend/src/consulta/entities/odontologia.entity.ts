import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Consulta } from './consulta.entity';

@Entity()
export class Odontologia {
  // esto lo hago para usar el id de la consulta como primaria y foranea
  @PrimaryGeneratedColumn({ type: 'int' })
  consultaId: number;

  @OneToOne(() => Consulta)
  @JoinColumn()
  consulta: Consulta;

  // datos de Odontologia
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
  dientes_norecuperables: number;

  @Column({ type: 'boolean' })
  cepillo: boolean;

  @Column({ type: 'varchar', length: 100 })
  habitos: string;

  @Column({ type: 'varchar', length: 100 })
  situacion_bucal: string;

  // Clasificación calculada
  @Column({ type: 'varchar', length: 100 })
  clasificacion: string;
}
