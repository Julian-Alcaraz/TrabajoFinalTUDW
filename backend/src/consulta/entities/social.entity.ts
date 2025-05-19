import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Consulta } from './consulta.entity';
import { Categoria } from '../../categoria/entities/categoria.entity';

@Entity('social')
export class Social {
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  @OneToOne(() => Consulta, (consulta) => consulta.social)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;

  @Column({ type: 'varchar', length: 100, nullable: true })
  demanda: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  articulacion: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  objeto_informe: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  seguimiento: string;

  // Relaciones

  @ManyToMany(() => Categoria, (categoria) => categoria.consultas)
  @JoinTable({
    name: 'categoria-social',
    joinColumn: {
      name: 'id_consulta',
      referencedColumnName: 'id_consulta',
    },
    inverseJoinColumn: {
      name: 'id_categoria',
      referencedColumnName: 'id',
    },
  })
  categorias: Categoria[];
}
