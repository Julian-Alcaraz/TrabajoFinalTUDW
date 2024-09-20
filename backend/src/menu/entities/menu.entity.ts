import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

import { MenuRol } from '../../menu-rol/entities/menu-rol.entity';

@Entity({ name: 'menus' })
export class Menu {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  label: string;

  @Column({ type: 'varchar', length: 100 })
  url: string;

  @Column({ type: 'integer' })
  orden: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon: string;

  // Relaciones

  @OneToMany(() => MenuRol, (menuRol) => menuRol.menu)
  menu_rol: MenuRol;

  @ManyToOne(() => Menu, (menu) => menu.sub_menus, { nullable: true })
  @JoinColumn({ name: 'menu_padre_id' })
  menu_padre: Menu | null;

  @OneToMany(() => Menu, (menu) => menu.menu_padre)
  sub_menus: Menu[];

  // Comunes:

  @Column({ type: 'boolean', default: false })
  deshabilitado: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
