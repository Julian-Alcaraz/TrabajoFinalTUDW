import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Consulta } from './consulta.entity';

@Entity('Clinica')
export class Clinica {
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  @OneToOne(() => Consulta)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;

  // Datos clinica general

  @Column({ type: 'boolean' })
  diabetes: boolean;

  @Column({ type: 'boolean' })
  hta: boolean;

  @Column({ type: 'boolean' })
  obesidad: boolean;

  @Column({ type: 'boolean' })
  consumo_alcohol: boolean;

  @Column({ type: 'boolean' })
  consumo_drogas: boolean;

  @Column({ type: 'boolean' })
  consumo_tabaco: boolean;

  @Column({ type: 'boolean' })
  antecedentes_perinatal: boolean;

  @Column({ type: 'boolean' })
  enfermedades_previas: boolean;

  @Column({ type: 'varchar', length: 100 })
  vacunas: string;

  @Column({ type: 'float' })
  peso: number;

  @Column({ type: 'float' })
  talla: number;

  @Column({ type: 'float' })
  pct: number;

  @Column({ type: 'float' })
  cc: number;

  @Column({ type: 'float' })
  imc: number;

  @Column({ type: 'float' })
  pcimc: number;

  @Column({ type: 'varchar', length: 100 })
  estado_nutricional: string;

  @Column({ type: 'float' })
  tas: number;

  @Column({ type: 'float' })
  tad: number;

  @Column({ type: 'float' })
  pcta: number;

  @Column({ type: 'varchar', length: 100 })
  tension_arterial: string;

  @Column({ type: 'varchar', length: 100 })
  examen_visual: string;

  @Column({ type: 'varchar', length: 100 })
  ortopedia_traumatologia: string;

  @Column({ type: 'varchar', length: 100 })
  lenguaje: string;

  @Column({ type: 'boolean' })
  segto: boolean;

  @Column({ type: 'varchar', length: 100 })
  alimentacion: string;

  @Column({ type: 'varchar', length: 100 })
  hidratacion: string;

  @Column({ type: 'boolean' })
  lacteos: boolean;

  @Column({ type: 'varchar', length: 100 })
  infusiones: string;

  @Column({ type: 'int' })
  numero_comidas: number;

  @Column({ type: 'varchar', length: 5 })
  horas_pantalla: string;

  @Column({ type: 'varchar', length: 5 })
  horas_juego_airelibre: string;

  @Column({ type: 'varchar', length: 5 })
  horas_suenio: string;

  // @Column({ type: 'varchar', length: 100 })
  // proyecto: string;
}
