import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chico {
  @PrimaryGeneratedColumn({ type: 'int' })
  dni: number;
  // datos niño
  @Column()
  nombre: string;
  @Column()
  apellido: string;
  @Column()
  sexo: string;
  @Column()
  fe_nacimiento: string;
  @Column()
  direccion: string;
  @Column()
  telefono: string;
  @Column()
  nombre_madre: string;
  @Column()
  nombre_padre: string;
  // no pondria turno
}
