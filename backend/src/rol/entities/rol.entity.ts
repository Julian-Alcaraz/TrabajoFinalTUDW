import { Entity, Column, OneToMany } from 'typeorm';

import { EntidadBasica } from '../../database/EntidadBasica';
import { MenuRol } from '../../menu-rol/entities/menu-rol.entity';
import { UsuarioRol } from '../../usuario-rol/entities/usuario-rol.entity';

@Entity({ name: 'roles' })
export class Rol extends EntidadBasica {
  @Column({ type: 'varchar', length: 100 }) // , unique: true
  nombre: string;

  // Relaciones

  @OneToMany(() => MenuRol, (menu_rol) => menu_rol.rol)
  menu_rol: MenuRol[];

  @OneToMany(() => UsuarioRol, (usuario_rol) => usuario_rol.rol)
  usuario_rol: UsuarioRol[];
}
