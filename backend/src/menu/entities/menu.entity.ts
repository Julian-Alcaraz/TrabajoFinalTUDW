import { Entity, Column, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';

import { EntidadBasica } from '../../database/EntidadBasica';
import { MenuRol } from '../../menu-rol/entities/menu-rol.entity';

@Entity({ name: 'menus' })
export class Menu extends EntidadBasica {
  @Column({ type: 'varchar', length: 100 })
  label: string;

  @Column({ type: 'varchar', length: 100 })
  url: string;

  @Column({ type: 'int' })
  orden: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon: string;

  // Relaciones

  @OneToMany(() => MenuRol, (menuRol) => menuRol.menu)
  menu_rol: MenuRol;

  @ManyToOne(() => Menu, (menu) => menu.sub_menus, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'menu_padre_id' })
  menu_padre: Menu;

  @OneToMany(() => Menu, (menu) => menu.menu_padre)
  sub_menus: Menu[];
}
