import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Consulta } from './consulta.entity';
import { VacunasType, VacunasEnum, ExamenVisualType, ExamenVisualEnum, OrtopediaYTraumatologiaType, OrtopediaYTraumatologiaEnum, LenguajeType, LenguajeEnum, AlimentacionType, AlimentacionEnum, InfusionesType, InfusionesEnum, CantidadComidasType, CantidadComidasEnum, HsPantallaType, HsPantallaEnum, HsJuegoAireLibreType, HsJuegoAireLibreEnum, HsSuenioType, HsSuenioEnum, HidratacionType, HidratacionEnum } from '../../common/const/const';

@Entity('clinica')
export class Clinica {
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  // Datos Clinica

  @Column({ type: 'enum', enum: VacunasEnum, nullable: true })
  vacunas: VacunasType;

  @Column({ type: 'enum', enum: ExamenVisualEnum, nullable: true })
  examen_visual: ExamenVisualType;

  @Column({ type: 'enum', enum: OrtopediaYTraumatologiaEnum, nullable: true })
  ortopedia_traumatologia: OrtopediaYTraumatologiaType;

  @Column({ type: 'enum', enum: LenguajeEnum, nullable: true })
  lenguaje: LenguajeType;

  @Column({ type: 'enum', enum: AlimentacionEnum, nullable: true })
  alimentacion: AlimentacionType;

  @Column({ type: 'enum', enum: InfusionesEnum, nullable: true })
  infusiones: InfusionesType;

  @Column({ type: 'enum', enum: CantidadComidasEnum, nullable: true })
  cantidad_comidas: CantidadComidasType;

  @Column({ type: 'enum', enum: HsPantallaEnum, nullable: true })
  horas_pantalla: HsPantallaType;

  @Column({ type: 'enum', enum: HsJuegoAireLibreEnum, nullable: true })
  horas_juego_aire_libre: HsJuegoAireLibreType;

  @Column({ type: 'enum', enum: HsSuenioEnum, nullable: true })
  horas_suenio: HsSuenioType;

  @Column({ type: 'enum', enum: HidratacionEnum, nullable: true })
  hidratacion: HidratacionType;

  @Column({ type: 'boolean', nullable: true })
  diabetes: boolean;

  @Column({ type: 'boolean', nullable: true })
  hta: boolean;

  @Column({ type: 'boolean', default: true })
  es_clinica: boolean;

  @Column({ type: 'boolean', nullable: true })
  obesidad: boolean;

  @Column({ type: 'boolean', nullable: true })
  consumo_alcohol: boolean;

  @Column({ type: 'boolean', nullable: true })
  consumo_drogas: boolean;

  @Column({ type: 'boolean', nullable: true })
  consumo_tabaco: boolean;

  @Column({ type: 'boolean', nullable: true })
  antecedentes_perinatal: boolean;

  @Column({ type: 'boolean', nullable: true })
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

  @Column({ type: 'float', nullable: true })
  tas: number;

  @Column({ type: 'float', nullable: true })
  tad: number;

  @Column({ type: 'float', nullable: true })
  pcta: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tension_arterial: string;

  @Column({ type: 'boolean' })
  segto: boolean;

  @Column({ type: 'boolean', nullable: true })
  leche: boolean;

  // Relaciones

  @OneToOne(() => Consulta, (consulta) => consulta.clinica)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;
}
