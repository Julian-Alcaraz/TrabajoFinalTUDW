import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import { Rol } from '../../rol/entities/rol.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity({ name: 'usuarios-roles' })
export class UsuarioRol {
  @PrimaryColumn()
  id_rol: number;

  @PrimaryColumn()
  id_usuario: number;

  // Relaciones

  @ManyToOne(() => Rol, (rol) => rol.usuario_rol)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuario_roles)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
