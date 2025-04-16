import { opcionesSexo, opcionesVacunas, opcionesExamenVisual, opcionesOrtopediaYTraumatologia, opcionesLenguaje, opcionesAlimentacion, opcionesInfusiones, opcionesCantidadComidas, opcionesHsPantalla, opcionesHsJuegoAireLibre, opcionesHsSuenio, opcionesHidratacion, opcionesConsulta, opcionesTurno, opcionesDiagnosticoPresuntivo, opcionesCausas, opcionesDemanda, opcionesCurso, opcionesTipoInstitucion, opcionesDuracion, opcionesDestinatarios, opcionesTurnoTalleres, opcionesConjuntoCon, opcionesEspecialidad, opcionesFrecuencia } from './opcionesConst';

export type SexoType = (typeof opcionesSexo)[number];
export const SexoEnum = opcionesSexo;

// Consulta

export type ConsultaType = (typeof opcionesConsulta)[number];
export const ConsultaEnum = opcionesConsulta;

export type TurnoType = (typeof opcionesTurno)[number];
export const TurnoEnum = opcionesTurno;

// Clinica

export type VacunasType = (typeof opcionesVacunas)[number];
export const VacunasEnum = opcionesVacunas;

export type ExamenVisualType = (typeof opcionesExamenVisual)[number];
export const ExamenVisualEnum = opcionesExamenVisual;

export type OrtopediaYTraumatologiaType = (typeof opcionesOrtopediaYTraumatologia)[number];
export const OrtopediaYTraumatologiaEnum = opcionesOrtopediaYTraumatologia;

export type LenguajeType = (typeof opcionesLenguaje)[number];
export const LenguajeEnum = opcionesLenguaje;

export type AlimentacionType = (typeof opcionesAlimentacion)[number];
export const AlimentacionEnum = opcionesAlimentacion;

export type InfusionesType = (typeof opcionesInfusiones)[number];
export const InfusionesEnum = opcionesInfusiones;

export type CantidadComidasType = (typeof opcionesCantidadComidas)[number];
export const CantidadComidasEnum = opcionesCantidadComidas;

export type HsPantallaType = (typeof opcionesHsPantalla)[number];
export const HsPantallaEnum = opcionesHsPantalla;

export type HsJuegoAireLibreType = (typeof opcionesHsJuegoAireLibre)[number];
export const HsJuegoAireLibreEnum = opcionesHsJuegoAireLibre;

export type HsSuenioType = (typeof opcionesHsSuenio)[number];
export const HsSuenioEnum = opcionesHsSuenio;

export type HidratacionType = (typeof opcionesHidratacion)[number];
export const HidratacionEnum = opcionesHidratacion;

// Fonoaudiologia

export type DiagnosticoPresuntivoType = (typeof opcionesDiagnosticoPresuntivo)[number];
export const DiagnosticoPresuntivoEnum = opcionesDiagnosticoPresuntivo;

export type CausasType = (typeof opcionesCausas)[number];
export const CausasEnum = opcionesCausas;

// Oftalmologia

export type DemandaType = (typeof opcionesDemanda)[number];
export const DemandaEnum = opcionesDemanda;

// Curso

export type NivelCursoType = (typeof opcionesCurso)[number];
export const NivelCursoEnum = opcionesCurso;

// Institucion

export type TipoInstitucionType = (typeof opcionesTipoInstitucion)[number];
export const TipoInstitucionEnum = opcionesTipoInstitucion;

// Taller

export type DuracionType = (typeof opcionesDuracion)[number];
export const DuracionEnum = opcionesDuracion;

export type DestinatariosType = (typeof opcionesDestinatarios)[number];
export const DestinatariosEnum = opcionesDestinatarios;

export type TurnoTalleresType = (typeof opcionesTurnoTalleres)[number];
export const TurnoTalleresEnum = opcionesTurnoTalleres;

export type ConjuntoConType = (typeof opcionesConjuntoCon)[number];
export const ConjuntoConEnum = opcionesConjuntoCon;

export type FrecuenciaType = (typeof opcionesFrecuencia)[number];
export const FrecuenciaEnum = opcionesFrecuencia;

// Especialidad

export type OpcionesEspecialidadType = (typeof opcionesEspecialidad)[number];
export const OpcionesEspecialidadEnum = opcionesEspecialidad;
