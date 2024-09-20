import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { MenuRol } from '../../menu-rol/entities/menu-rol.entity';
import { UsuarioRol } from '../../usuario-rol/entities/usuario-rol.entity';

@Entity({ name: 'roles' })
export class Rol {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 100 }) // , unique: true
  nombre: string;

  // Relaciones

  @OneToMany(() => MenuRol, (menu_rol) => menu_rol.rol)
  menu_rol: MenuRol[];

  @OneToMany(() => UsuarioRol, (usuario_rol) => usuario_rol.rol)
  usuario_rol: UsuarioRol[];

  // Comunes

  @Column({ type: 'boolean', default: false })
  deshabilitado: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
