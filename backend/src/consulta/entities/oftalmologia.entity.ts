import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Consulta } from './consulta.entity';

@Entity()
export class Oftalmologia {
  @PrimaryGeneratedColumn({ type: 'int' })
  consultaId: number;

  @OneToOne(() => Consulta)
  @JoinColumn()
  consulta: Consulta;

  @Column({ type: 'varchar', length: 100, nullable: false })
  demanda: string;

  @Column({ type: 'boolean', nullable: false })
  primera_vez: boolean;

  @Column({ type: 'boolean', nullable: false })
  control: boolean;

  @Column({ type: 'boolean', nullable: false })
  receta: boolean;

  @Column({ type: 'date', nullable: false })
  prox_control: Date;

  @Column({ type: 'boolean', nullable: false })
  anteojos: boolean;
}
