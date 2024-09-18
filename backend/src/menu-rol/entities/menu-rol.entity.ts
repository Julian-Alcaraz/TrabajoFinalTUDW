import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import { Rol } from './../../rol/entities/rol.entity';
import { Menu } from '../../menu/entities/menu.entity';

@Entity({ name: 'menus-roles' })
export class MenuRol {
  @PrimaryColumn()
  id_rol: number;

  @PrimaryColumn()
  id_menu: number;

  // Relaciones

  @ManyToOne(() => Rol, (rol) => rol.menu_rol)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @ManyToOne(() => Menu, (menu) => menu.menu_rol)
  @JoinColumn({ name: 'id_menu' })
  menu: Menu;
}
