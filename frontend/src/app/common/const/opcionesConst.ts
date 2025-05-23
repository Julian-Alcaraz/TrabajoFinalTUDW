export const opcionesSexo = ['Femenino', 'Masculino', 'Otro'] as const;
export const estadoNutricional = ['B Bajo peso/Desnutrido', 'A Riesgo Nutricional', 'C Eutrófico', 'D Sobrepeso', 'E Obesidad'] as const;
export const typeConsultas = ['Clinica', 'Odontologia', 'Oftalmologia', 'Fonoaudiologia', 'Prevencion', 'Social'] as const;
export const tensionArterial = ['Normotenso', 'Riesgo', 'Hipertenso'] as const;

// Consulta

export const opcionesConsulta = ['Clinica', 'Fonoaudiologia', 'Oftalmologia', 'Odontologia', 'Prevencion', 'Social'] as const;
export const opcionesTurno = ['Mañana', 'Tarde', 'Noche', 'Jornada Completa'] as const;

// Clinica

export const opcionesVacunas = ['Completo', 'Incompleto', 'Desconocido'] as const;
export const opcionesExamenVisual = ['Normal', 'Anormal', 'Desconocido'] as const;
export const opcionesOrtopediaYTraumatologia = ['Normal', 'Escoliosis', 'Pie Plano', 'Otras', 'Desconocido'] as const;
export const opcionesLenguaje = ['Adecuado', 'Inadecuado'] as const;
export const opcionesAlimentacion = ['Mixta y variada', 'Rica en HdC', 'Pobre en fibras', 'Fiambres', 'Frituras', 'Desconocido'] as const;
export const opcionesInfusiones = ['Té', 'Mate Cocido', 'Otras'] as const;
export const opcionesCantidadComidas = ['Mayor a 4', '4', 'Menor a 4', 'Picoteo'] as const;
export const opcionesHsPantalla = ['Menor a 2hs', 'Entre 2hs y 4hs', 'Más de 6hs'] as const;
export const opcionesHsJuegoAireLibre = ['Menos de 1h', '1h', 'Más de 1h'] as const;
export const opcionesHsSuenio = ['Menos de 10hs', 'Entre 10hs y 12hs', 'Más de 13hs'] as const;
export const opcionesHidratacion = ['Agua', 'Bebidas Edulcoradas', 'Desconocido'] as const;

// Fonoaudiologia

export const opcionesDiagnosticoPresuntivo = ['TEL', 'TEA', 'Retraso en el lenguaje, dislalias funcionales', 'Respirador bucal', 'Anquiloglosia', 'Ortodoncia: Protrusión lingual, paladar hendido', 'Síndromes', 'Otras patologías que dificulten el lenguaje y la comunicación'] as const;
export const opcionesCausas = ['Prenatal', 'Postnatal', 'ACV', 'Respiratorias', 'Audición', 'Patologías clínicas', 'Síndromes', 'Inflamación de amígdalas o adenoides', 'Prematurez', 'Otras'] as const;

// Oftalmologia

export const opcionesDemanda = ['Control niño sano', 'Docente', 'Familiar', 'Otro'] as const;

// Prevencion

export const motivoConsumo = ['Curiosidad', 'Presion de grupo', 'Ritos Familiar', 'Otro'] as const;
export const frecuenciaPrevencion = ['Todos los dias', '2 veces por semana', '3 veces por semana', 'Fines de semana', 'Esporádico', 'Otro'] as const;
export const consumoProblematico = ['Alchol', 'Marihuana', 'Cocaina', 'Tabaco', 'Otra'] as const;
export const otraProblematica = ['Consumo problematico', 'Bajo rendimiento', 'Violencia familiar', 'Depresion', 'Bullying', 'Otra'] as const;

// Curso

export const opcionesCurso = ['Jardin', 'Primario', 'Secundario'] as const;

// Institucion

export const opcionesTipoInstitucion = ['Jardin', 'Primario', 'Secundario', 'Terciario'] as const;

// Taller

export const opcionesDuracion = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const opcionesDestinatarios = ['Alumnos', 'Docentes', 'Familias', 'PSA', 'Todos'];
export const opcionesTurnoTalleres = ['Mañana', 'Tarde', 'M y T', 'JC'];
export const opcionesConjuntoCon = ['Odontologia', 'Nutricion', 'Medicina', 'Trabajo Social', 'Psicologia', 'Equipo tecnico de apoyo', 'Sin compania', 'Pasantes', 'Otros'];
export const opcionesFrecuencia = ['Única vez', 'Diaria', 'Semanal', 'Mensual'];

// Especialidad

export const opcionesEspecialidad = ['Prevencion', 'Fonoaudiologia', 'Nutricion', 'Odontologia', 'Clinica'];
