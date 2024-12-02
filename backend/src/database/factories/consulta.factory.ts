import { faker } from '@faker-js/faker/locale/es';
import { setSeederFactory } from 'typeorm-extension';

import { Consulta } from '../../consulta/entities/consulta.entity';

type DerivacionesType = {
  odontologia: boolean;
  oftalmologia: boolean;
  fonoaudiologia: boolean;
  externa: boolean;
};

const observacionesClinica = [
  'No se dejó medir la TA',
  'No se dejó medir el abdomen',
  'No realizó el control',
  'No se guardaron los datos',
  'Remplaza la letra c por la t',
  'Toma teta. Lloró como un marrano',
  'OVAS',
  'No menciona ninguna palabra claramente',
  'Mucho consumo de golosinas, caramelos, gaseosas cada tanto',
  'Shock séptico a los 10 meses. Internado en Roca JXXIII',
  'Esta sin comer, porque la mamá no cobró y está recién separada. Momeplus 09/06/23 por dermatitis',
  'Inquieto, no pronuncia la r, dice ojo en vez de rojo',
  "Infección umbilical a los 15 días de nacida. No le puso las vacunas por 'vaga', refiere la mamá",
  'Madre con hipotiroidismo. Niño con epistaxis. Pie plano',
  'Pendiente cx por quiste en mejilla derecha. Vista por médico en Hosp. Cipolletti',
  'Prematuro. Toma mamadera',
  'No se dejó revisar',
  'La mamá se encuentra cursando embarazo de 29 semanas, reconoce que su hija está delgada',
  'No pronuncia la letra R. La reemplaza por la D y la J por la letra T',
  'Verduras y huevo no come',
  'Consume muchas papitas, gaseosas y golosinas',
  'Hipertrofia amigdalina. OVAS',
  'Nevo congénito en la coronilla. En seguimiento por dermatóloga Marra cada dos años',
  'Mala higiene corporal en general',
  'No tiene disminución de la agudeza visual, pero cierra el ojo izquierdo habitualmente',
  'Ecografía con múltiples ganglios a nivel del cuello',
  'El abuelo de la nena es alcohólico y se mudaron de la casa por ese motivo',
  'Fractura de tibia y peroné a los 2 meses de edad',
  'DBT gestacional',
  'Adenitis cervical en estudio, pero con dificultad para usar la obra social',
  'El abuelo fallece hace 8 años con antecedentes de alcoholismo',
  'Parálisis braquial en brazo derecho. Violencia obstétrica',
  'Intoxicación con ibuprofeno hace 2 años. Tratada en el hospital',
  'Dermatitis atópica',
  'Queratosis pilaris',
  'Gaseosa los fines de semana',
  'Prematuro 33 semanas. Estrabismo, en lista de espera para cirugía',
  'Dificultad para tragar. Hipertrofia amigdalina',
  'Parasitosis desde hace dos meses',
  'Respirador bucal. Hipertrofia amigdalina',
  'Dice culo en vez de burro',
  'Accidente de tránsito durante el embarazo, pérdida de líquido amniótico',
  'Abuelo materno consumo de drogas y tío materno consumo de alcohol en exceso',
  'Fractura de cráneo a los 24 meses',
  'No quiere bañarse todos los días',
  'Internada por deshidratación a los 12 meses',
  'Padre problemas con drogas y alcohol',
  'Convulsiones febriles desde los 10 meses, refiere la hermana',
  'Neumonía tratada en el hospital Cipolletti',
  'Prematuro, 7 meses. Broncoespasmo tratado durante el 1er año de vida',
  'A cargo de la abuela',
  'Hematoma placentario a las 32 semanas, cesárea. Prematuro extremo',
  'Convulsiones febriles a los 2 años',
  'Pie plano bilateral',
  'Madre con lupus',
  'Cesárea por DCP, RN a término',
  'Menor con CIV muscular en ápex, sin repercusión HD',
  'Embarazo gemelar, 37 semanas, con infección respiratoria neonatal',
  'Padres trabajan todo el día',
  'Chagas perinatal',
  'SHE en las 3 gestaciones, cesárea',
  'Uso de drogas durante el embarazo, intento de IVE no concluyente',
  'Consejería en higiene',
  'Antec. de aborto espontáneo',
  'Infección respiratoria, apnea y membrana hialina',
  'Diarreas frecuentes',
  'Separación reciente del marido (3 meses)',
  'S/P',
  'Dermatitis',
  'Cesárea por oligohidroamnios a las 39 SDG',
  'Preeclampsia, cesárea',
  'Macrosomía fetal, cesárea 38 SDG',
  'Toma mamadera',
  'Caries en incisivos',
  'Fonación nasal',
  'Se orina en la ropa',
];

const observacionesOftalmologia = ['le dieron turno para fondo de ojos y no asistio', 'le indicaron cirugia', 'se le entrga nuevo turno ya que tenia control a los 2 meses, turno anterior 2 de mayo, le entrgan receta de medicacion oftalmica', 'control luego de colocarse la medicacion', 'fondo de ojos', '16/4 fondo de ojos', 'no asistio al truno'];

const observacionesOdontologia = [
  'DEGLUCIÒN ATIPICA',
  'ELEMENTO 11  CONOIDE',
  'CARIES MACROPENETRANTES',
  'DEGLUCION ATIPICA',
  'Derivación al odontologo',
  'Derivaciòn al odontologo',
  'DERIVACIÓN ODONTOLOGICA- MORDIDA BORDE A BORDE',
  'DERIVACIÓN ODONTOLOGICA- AGENESIA DEL ELEMENTO 81',
  'DERIVACÓN ODONTOLÓGICA',
  'DIENTE SUPERNUMERARIO ENTRE 51 Y 61. CONSUME MUCHA GASEOSA',
  'DERIVACIÓN ODONTOLÓGICA Y FONOADIOLOGICA -INTERPOSICIÓN LINGUAL-',
  'INTERPOSICIÓN LINGUAL',
  'INTERPOSICIÓN LINGUAL, HABLA CON "Z"',
  'DERIVACIÓN ODONTOLÓGICA Y FONOAUDIOLÓGICA -INTERPOSICIÓN LINGUAL-',
  'DIFICULTAD DEL HABLA',
  'INTERPOSICION LINGUAL, DIFICULTAD DEL HABLA, DERIVACIÓN ODONTOLÓGICA. FISTULA EN EL ELEMENTO 61',
  'DERIVACIÓN AL ODONTOLOÓGO. HAY 2 ELEMENTOS PARA EXTRACCIÓN',
  'INTERPOSICION LINGUAL. DERIVACIÓN AL OTORRINO - AMIGDALAS GRANDES-.',
  'DERIVACIÓN AL FONOAUDIOLOGO Y ODONTÓLOGO',
  'DERIVACIÒN FONOAUDIOLOGICA',
  'DERIVACIÒN FONOAUDIOLOGICA, NO DICE LA "R"',
  'DERIVACIÓN ODONTOLOGICA. MUCHA CANTIDAD DE SARRO. MOLAR PERMANENTE CON CARIES',
  'DERIVACIÓN ODONTOLOÓCICA. NO HABLABA. MORDIDA ABIERTA. INTERPOSICIÓN LINGUAL. LOS 4 MOLARES PERMANENTES CON CARIES',
  'DERIVACIÓN ODONTOLÓGICA. INTERPOSICION LINGUAL',
  'CONCURRE A VISITAS ODONTOLÓGICAS. TIENE ARREGLOS HECHOS. SE LE RECOMENDO REALIZAR SELLADORES. POSEE 21 CONOIDE Y DIENTES SUPERNUMERARIOS.',
  'Derivación odontológica. No tiene habito de cepillado, come gran cantidad de dulces. Tenia gran proceso infeccioso, ganglios inflamados contralateral a la lesion. Ya tomo antibioticos.',
  'Derivación odontologica. Agenecia del elemento 82. Tuvo un golpe y perdio los elementos 51 y 61, Controlar proceso eruptivo de 11 y 21. POSIBLE PEDIDO DE RX-',
  'Mordida borde a borde',
  'Derivación odontológica. Elemento 51 con anomalia de forma',
  'Derivación odontológica. Mordida invertida anterior. Derivación Fonoaaudiologia',
  'Derivación odontológica. Mordida invertida anterior. Derivación Fonoaaudiologia',
  'Deficit de atención, derivacion al odontologo',
  'Deficit de atenciòn, dificultad en el lenguaje.',
  'No se dejo atender',
  'Muy inquieta. Dificultad en el habla. Elementos 82 y 83 fusionados.',
  'Derivación al odontologo',
  'Derivacion al odontologo. exceso de energia, deficit de atención',
  'Dificultad en el habla.',
  'Vive con la abuel. nació de 7 meses. No tomo teta ni c. folico. La mama consumio durante el embarazo. Alteraciones en la estructura de los tejidos dentarios.',
  'Amígdalas agrandadas. derivo a otorrino',
  'Problemas de conducta',
  'Derivacion al odontologo',
  'Respirados bucal. Amigdalas agrandadas. Derivacion al otorrinonaringologo.',
  'No se dejo atender. Paciente con autismo',
  'Elementos 81 y 82 fusionados.',
  'Elementos 51 y 61 fusionados.',
  'Derive a odontologo por caries y extraccion de elementos 54 y 64',
  'Derivacion por amigdalas aumentadas de tamaño. La mamá comento que la nena hace infecciones urinarias a repetición y se esta ocupando del tema. Hace tratamientos con corticoide por episodios repetidos de laringuitis. Comento saber que su hija esta con sobrepeso, y que la estaba mandando a clases de patin pero entre la laringuitis y la infeccion urinaria se le hace muy dificil poder continuar con la actividad. Tiene obrasocial inactiva. La llevo en Febrero al odontologo con cobertura de su obrasocial y le realizaron un arreglo oclusal en el elemento 84.',
  'Deivacion con otorrinonaringologo por aumento de crecimiento en las amigdalas palatinas. La mamá relató que los elementos 71 y 81 aparecieron en boca al rededor de los 3 meses y el 81 ya presenta movilidad.',
  'Derivación fonoaudiologo por interposicion lingual y deglucion atipica',
  'Va al odontologo. Toma mamadera',
  'Mordida invertida del lado derecho',
  'Mordida borde a borde anterior',
  'Mordida invertida. Derivacion a otorrino naringologo',
  'Mordida invertida.',
  'Usa mamadera. mordida borde a borde. derivacion al odontologo.',
  'Elementos 52,51,61,62 con descalcificacion. Amigdalas hipertroficas. dificultad del habla.',
  'El elemento 51 esta necrosado por un golpe en el jardin. Concurrio a la consulta 2 semanas despues por lo que no pudieron hacer nada para mantener  vitalidad del diente.  Interposicion lingual derivo a RODRI. DEGLUCION ATIPICA',
  'Dificultad en el habla por frenillo lingual corto.',
  'Derivacion ODONTOLOGICA.Nacio con el diente 71 erupcionado y esta para extraccion',
  'Parece niño con nsindrome de Down pero los padres en la consulta no hicieron mencion',
  'Dificultad del habla. Derivación a odontologo y fonoaudiologo',
  'Elementos 51 y 52 fusionaodos',
  'Derivación odontologica',
  'Problemas de deglucion. derivacion odontologica y fonoaudiologo',
  'Derivacion fonoaudiologica. dificultad del habla',
  'Derivado al odontologo.',
  'Derivación odontologo.',
  'Derivación odontologo. Tiene un golpe en los elementos 51 y 61 y presenta dolor.',
  'Derivación odontologica. Derivacion fonoaudiologia (habla con Z y no pronuncia R.)',
  'Adeinoides e hiperflexia',
  'Tiene 2 muelas con caries, 5 dientes con caries.',
  'Mordida abierta, se chupa el dedo',
  'Tiene 3 primeros molares en boca',
  'ODONTO pulpotomia 85, inactivacion de caries en 81 y 74.',
  'CARIES',
  'FONO- DEGLUSION ATIPICA, MORDIDA ABIERTA ANTERIOR',
  'ODONTO',
  'BOCA SANA',
  'Derivacion fono- interposicion lingual',
  'DERIVACION ODONTO',
  'Recibe atencion de mala calidad.',
  'DEGLUSION ATIPICA. FONOAUDIOLOGO',
  'Derivacion odontologica. Tiene dos arreglos. Usa mamadera. Necesita Fonoaudiologo.',
  'DERIVACION ODONTOLOGICA. 1 ARREGLO HECHO',
  'Derivacion odontologica. Tiene mordida invertida',
  'DERIVACIÓN ODONTOLOGICA',
  'DERIVACION ODONTOLOGICA Y FONOAUDIOLOGO. Inactivacion de caries en 53,63 y 84.',
  'DERIVACIÓN ODONTOLOGICA. Historia clinica, pulpotomia ED  75 y 84. Inactivacion de caries en 64 y 85.',
  'Derivacion odontologica, otorrino (amigdalas aumentadas de tamaño)',
  'No dejo hacerse cepillado mecanico, revelador de placa bacteriana ni topoicacion con fluor',
  'No pude controlarlo',
  'Acompaña las comidas con jugo',
  'Consume bebidas azucaradas y golosinas. 5 comidas al dia.',
  'Mas de momentos de azucar',
  'Consume muchas golosinas',
  'Cepilla sus dientes solo 3  veces por dia',
  'Toma mamadera, Pulpotomia 74 y 54. inactivacion 55',
  'Tomo teta y mamadera hasta junio de este año',
  'No cepilla sus dientes, consume jugos y gaseosas todos los dias, derivado al odontologo.',
  'Cepilla sus dientes 1 vez al dia.',
  'Solo toma agua. Cepilla sus dientes luego del desayuno y luego de la cena. Asiste al odontologo 1 vez al año.',
  'No recibe atencion odontologica.',
  'Tiene sangrado gingival. No puede comer alimentos solidos.',
  'Consumen alimentos azucarados.',
];

const observacionesFonoaudiologia = ['TFA', 'TFA - AFH', 'TFA', 'TFA', 'Habla guaraní', 'traslada dif a la escritura', 'DIF Lectoescritura', 'AFH', 'TDL', 'TSH', 'TSH LEVE', 'TSH - TDL'];

enum TurnoType {
  Mañana = 'Mañana',
  Tarde = 'Tarde',
  Noche = 'Noche',
}

enum ConsultaType {
  Clinica = 'Clinica',
  Fonoaudiologia = 'Fonoaudiologia',
  Oftalmologia = 'Oftalmologia',
  Odontologia = 'Odontologia',
}

export const ConsultaFactory = setSeederFactory(Consulta, async () => {
  const consulta = new Consulta();
  consulta.obra_social = Math.random() > 0.5 ? true : false;
  const turnos = [TurnoType.Mañana, TurnoType.Tarde, TurnoType.Noche];
  consulta.turno = turnos[Math.floor(Math.random() * turnos.length)];

  const types = [ConsultaType.Clinica, ConsultaType.Fonoaudiologia, ConsultaType.Oftalmologia, ConsultaType.Odontologia];
  consulta.type = types[Math.floor(Math.random() * types.length)];
  const derivaciones: DerivacionesType = {
    odontologia: Math.random() > 0.5,
    oftalmologia: Math.random() > 0.5,
    fonoaudiologia: Math.random() > 0.5,
    externa: Math.random() > 0.5,
  };

  if (consulta.type === 'Clinica') {
    consulta.observaciones = Math.random() > 0.5 ? faker.helpers.arrayElement(observacionesClinica) : null;
  } else if (consulta.type === 'Odontologia') {
    consulta.observaciones = Math.random() > 0.5 ? faker.helpers.arrayElement(observacionesOdontologia) : null;
  } else if (consulta.type === 'Fonoaudiologia') {
    consulta.observaciones = Math.random() > 0.5 ? faker.helpers.arrayElement(observacionesFonoaudiologia) : null;
  } else if (consulta.type === 'Oftalmologia') {
    consulta.observaciones = Math.random() > 0.5 ? faker.helpers.arrayElement(observacionesOftalmologia) : null;
  }

  // consulta.observaciones = Math.random() > 0.5 ? faker.word.words({ count: { min: 50, max: 1000 } }) : null;
  consulta.derivaciones = derivaciones;
  return consulta;
});
