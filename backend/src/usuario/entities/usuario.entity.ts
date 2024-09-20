import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { UsuarioRol } from '../../usuario-rol/entities/usuario-rol.entity';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'integer', unique: true })
  dni: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  contrasenia: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  especialidad: string;

  @Column({ type: 'date' })
  fe_nacimiento: Date;

  // Relaciones

  @OneToMany(() => UsuarioRol, (usuario_rol) => usuario_rol.usuario)
  usuario_roles: UsuarioRol[];

  // Comunes

  @Column({ type: 'boolean', default: false })
  deshabilitado: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
