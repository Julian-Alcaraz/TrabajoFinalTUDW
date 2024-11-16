import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Consulta } from './consulta.entity';

export type VacunasType = 'Completo' | 'Incompleto' | 'Desconocido';
export type ExamenVisualType = 'Normal' | 'Anormal';
export type OrtopediaYTraumatologiaType = 'Normal' | 'Escoliosis' | 'Pie Plano' | 'Otras';
export type LenguajeType = 'Adecuado' | 'Inadecuado';
export type AlimentacionType = 'Mixta y variada' | 'Rica en HdC' | 'Pobre en fibras' | 'Fiambres' | 'Frituras';
export type InfusionesType = 'Té' | 'Mate Cocido' | 'Otras';
export type CantidadComidasType = 'Mayor a 4' | '4' | 'Menor a 4' | 'Picoteo';
export type HsPantallaType = 'Menor a 2hs' | 'Entre 2hs y 4hs' | 'Más de 6hs';
export type HsJuegoAireLibreType = 'Menos de 1h' | '1h' | 'Más de 1h';
export type HsSuenioType = 'Menos de 10hs' | 'Entre 10hs y 12hs' | 'Más de 13hs';
export type HidratacionType = 'Agua' | 'Bebidas Edulcoradas';

@Entity('clinica')
export class Clinica {
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  // Datos Clinica

  @Column({ type: 'enum', enum: ['Completo', 'Incompleto', 'Desconocido'] })
  vacunas: VacunasType;

  @Column({ type: 'enum', enum: ['Normal', 'Anormal'] })
  examen_visual: ExamenVisualType;

  @Column({ type: 'enum', enum: ['Normal', 'Escoliosis', 'Pie Plano', 'Otras'] })
  ortopedia_traumatologia: OrtopediaYTraumatologiaType;

  @Column({ type: 'enum', enum: ['Adecuado', 'Inadecuado'] })
  lenguaje: LenguajeType;

  @Column({ type: 'enum', enum: ['Mixta y variada', 'Rica en HdC', 'Pobre en fibras', 'Fiambres', 'Frituras'] })
  alimentacion: AlimentacionType;

  @Column({ type: 'enum', enum: ['Té', 'Mate Cocido', 'Otras'] })
  infusiones: InfusionesType;

  @Column({ type: 'enum', enum: ['Menor a 4', '4', 'Mayor a 4', 'Picoteo'] })
  cantidad_comidas: CantidadComidasType;

  @Column({ type: 'enum', enum: ['Menor a 2hs', 'Entre 2hs y 4hs', 'Más de 6hs'] })
  horas_pantalla: HsPantallaType;

  @Column({ type: 'enum', enum: ['Menos de 1h', '1h', 'Más de 1h'] })
  horas_juego_aire_libre: HsJuegoAireLibreType;

  @Column({ type: 'enum', enum: ['Menos de 10hs', 'Entre 10hs y 12hs', 'Más de 13hs'] })
  horas_suenio: HsSuenioType;

  @Column({ type: 'enum', enum: ['Agua', 'Bebidas Edulcoradas'] })
  hidratacion: HidratacionType;

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

  @Column({ type: 'boolean' })
  segto: boolean;

  @Column({ type: 'boolean' })
  leche: boolean;

  // Relaciones

  @OneToOne(() => Consulta)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;
}
