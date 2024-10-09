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
  @Column()
  primera_vez: boolean;

  @Column()
  ulterior: boolean;z

  @Column()
  dientes_permanentes: number;

  @Column()
  dientes_temporales: number;

  @Column()
  sellador: number;

  @Column()
  topificacion: boolean;

  @Column()
  cepillado: boolean;

  @Column()
  derivacion: boolean;

  @Column()
  dientes_recuperables: number;

  @Column()
  dientes_norecuperables: number;

  @Column()
  cepillo: boolean;

  @Column()
  habitos: string;

  @Column()
  situacion_bucal: string;

  // Clasificación calculada
  @Column()
  clasificacion: string;
}
