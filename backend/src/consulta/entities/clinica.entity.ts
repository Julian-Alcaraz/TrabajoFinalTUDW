import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Consulta } from './consulta.entity';
import { VacunasType, VacunasEnum, ExamenVisualType, ExamenVisualEnum, OrtopediaYTraumatologiaType, OrtopediaYTraumatologiaEnum, LenguajeType, LenguajeEnum, AlimentacionType, AlimentacionEnum, InfusionesType, InfusionesEnum, CantidadComidasType, CantidadComidasEnum, HsPantallaType, HsPantallaEnum, HsJuegoAireLibreType, HsJuegoAireLibreEnum, HsSuenioType, HsSuenioEnum, HidratacionType, HidratacionEnum } from '../../common/const/const';

@Entity('clinica')
export class Clinica {
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  // Datos Clinica

  @Column({ type: 'enum', enum: VacunasEnum })
  vacunas: VacunasType;

  @Column({ type: 'enum', enum: ExamenVisualEnum })
  examen_visual: ExamenVisualType;

  @Column({ type: 'enum', enum: OrtopediaYTraumatologiaEnum })
  ortopedia_traumatologia: OrtopediaYTraumatologiaType;

  @Column({ type: 'enum', enum: LenguajeEnum })
  lenguaje: LenguajeType;

  @Column({ type: 'enum', enum: AlimentacionEnum })
  alimentacion: AlimentacionType;

  @Column({ type: 'enum', enum: InfusionesEnum })
  infusiones: InfusionesType;

  @Column({ type: 'enum', enum: CantidadComidasEnum })
  cantidad_comidas: CantidadComidasType;

  @Column({ type: 'enum', enum: HsPantallaEnum })
  horas_pantalla: HsPantallaType;

  @Column({ type: 'enum', enum: HsJuegoAireLibreEnum })
  horas_juego_aire_libre: HsJuegoAireLibreType;

  @Column({ type: 'enum', enum: HsSuenioEnum })
  horas_suenio: HsSuenioType;

  @Column({ type: 'enum', enum: HidratacionEnum })
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

  @OneToOne(() => Consulta, (consulta) => consulta.clinica)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;
}
