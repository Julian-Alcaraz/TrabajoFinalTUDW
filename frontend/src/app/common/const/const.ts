import { opcionesSexo, opcionesVacunas, opcionesExamenVisual, opcionesOrtopediaYTraumatologia, opcionesLenguaje, opcionesAlimentacion, opcionesInfusiones, opcionesCantidadComidas, opcionesHsPantalla, opcionesHsJuegoAireLibre, opcionesHsSuenio, opcionesHidratacion, opcionesConsulta, opcionesTurno, opcionesDiagnosticoPresuntivo, opcionesCausas, opcionesDemanda, opcionesCurso, opcionesTipoInstitucion, opcionesDuracion, opcionesDestinatarios, opcionesTurnoTalleres, opcionesConjuntoCon, opcionesEspecialidad } from './opcionesConst';

export type SexoType = (typeof opcionesSexo)[number];
export const SexoEnum: string[] = [...opcionesSexo];

// Consulta

export type ConsultaType = (typeof opcionesConsulta)[number];
export const ConsultaEnum: string[] = [...opcionesConsulta];

export type TurnoType = (typeof opcionesTurno)[number];
export const TurnoEnum: string[] = [...opcionesTurno];

// Clinica

export type VacunasType = (typeof opcionesVacunas)[number];
export const VacunasEnum: string[] = [...opcionesVacunas];

export type ExamenVisualType = (typeof opcionesExamenVisual)[number];
export const ExamenVisualEnum: string[] = [...opcionesExamenVisual];

export type OrtopediaYTraumatologiaType = (typeof opcionesOrtopediaYTraumatologia)[number];
export const OrtopediaYTraumatologiaEnum: string[] = [...opcionesOrtopediaYTraumatologia];

export type LenguajeType = (typeof opcionesLenguaje)[number];
export const LenguajeEnum: string[] = [...opcionesLenguaje];

export type AlimentacionType = (typeof opcionesAlimentacion)[number];
export const AlimentacionEnum: string[] = [...opcionesAlimentacion];

export type InfusionesType = (typeof opcionesInfusiones)[number];
export const InfusionesEnum: string[] = [...opcionesInfusiones];

export type CantidadComidasType = (typeof opcionesCantidadComidas)[number];
export const CantidadComidasEnum: string[] = [...opcionesCantidadComidas];

export type HsPantallaType = (typeof opcionesHsPantalla)[number];
export const HsPantallaEnum: string[] = [...opcionesHsPantalla];

export type HsJuegoAireLibreType = (typeof opcionesHsJuegoAireLibre)[number];
export const HsJuegoAireLibreEnum: string[] = [...opcionesHsJuegoAireLibre];

export type HsSuenioType = (typeof opcionesHsSuenio)[number];
export const HsSuenioEnum: string[] = [...opcionesHsSuenio];

export type HidratacionType = (typeof opcionesHidratacion)[number];
export const HidratacionEnum: string[] = [...opcionesHidratacion];

// Fonoaudiologia

export type DiagnosticoPresuntivoType = (typeof opcionesDiagnosticoPresuntivo)[number];
export const DiagnosticoPresuntivoEnum: string[] = [...opcionesDiagnosticoPresuntivo];

export type CausasType = (typeof opcionesCausas)[number];
export const CausasEnum: string[] = [...opcionesCausas];

// Oftalmologia

export type DemandaType = (typeof opcionesDemanda)[number];
export const DemandaEnum: string[] = [...opcionesDemanda];

// Curso

export type NivelCursoType = (typeof opcionesCurso)[number];
export const NivelCursoEnum: string[] = [...opcionesCurso];

// Institucion

export type TipoInstitucionType = (typeof opcionesTipoInstitucion)[number];
export const TipoInstitucionEnum: string[] = [...opcionesTipoInstitucion];

// Taller

export type DuracionType = (typeof opcionesDuracion)[number];
export const DuracionEnum = opcionesDuracion;

export type DestinatariosType = (typeof opcionesDestinatarios)[number];
export const DestinatariosEnum = opcionesDestinatarios;

export type TurnoTalleresType = (typeof opcionesTurnoTalleres)[number];
export const TurnoTalleresEnum = opcionesTurnoTalleres;

export type ConjuntoConType = (typeof opcionesConjuntoCon)[number];
export const ConjuntoConEnum = opcionesConjuntoCon;

// Especialidad

export type OpcionesEspecialidadType = (typeof opcionesEspecialidad)[number];
export const OpcionesEspecialidadEnum = opcionesEspecialidad;
