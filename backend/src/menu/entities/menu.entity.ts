import { Entity, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

import { EntidadBasica } from '../../database/entities/EntidadBasica';
import { Rol } from '../../rol/entities/rol.entity';

@Entity({ name: 'menu' })
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

  @ManyToMany(() => Rol, (rol) => rol.menus)
  @JoinTable({
    name: 'menu-rol',
    joinColumn: {
      name: 'id_menu',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_rol',
      referencedColumnName: 'id',
    },
  })
  roles: Rol[];

  @ManyToOne(() => Menu, (menu) => menu.sub_menus, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'menu_padre_id' })
  menu_padre: Menu | null;

  @OneToMany(() => Menu, (menu) => menu.menu_padre)
  sub_menus: Menu[];
}
