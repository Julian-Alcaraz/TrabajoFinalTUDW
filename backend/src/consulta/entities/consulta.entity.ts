import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Consulta extends EntidadBasica {
  @Column()
  type: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  usuario: Usuario;
}
