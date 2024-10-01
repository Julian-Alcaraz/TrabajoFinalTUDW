import { Entity, Column, ManyToMany } from 'typeorm';

import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Menu } from '../../menu/entities/menu.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity({ name: 'roles' })
export class Rol extends EntidadBasica {
  @Column({ type: 'varchar', length: 100 }) // , unique: true
  nombre: string;

  // Relaciones

  @ManyToMany(() => Menu, (menu) => menu.roles)
  menus: Menu[];

  @ManyToMany(() => Usuario, (usuario) => usuario.roles)
  usuarios: Usuario[];
}
