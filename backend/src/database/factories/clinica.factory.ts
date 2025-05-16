import { faker } from '@faker-js/faker/locale/es';
import { setSeederFactory } from 'typeorm-extension';

import { Clinica } from '../../consulta/entities/clinica.entity';

enum VacunasType {
  completo = 'Completo',
  incompleto = 'Incompleto',
  desconocido = 'Desconocido',
}

enum ExamenVisualType {
  normal = 'Normal',
  anormal = 'Anormal',
}

enum OrtopediaTraumatologiaType {
  normal = 'Normal',
  escoliosis = 'Escoliosis',
  piePlano = 'Pie Plano',
  otras = 'Otras',
}

enum LenguajeType {
  adecuado = 'Adecuado',
  inadecuado = 'Inadecuado',
}

enum AlimentacionType {
  mixtaYVariada = 'Mixta y variada',
  ricaEnHdC = 'Rica en HdC',
  pobreEnFibras = 'Pobre en fibras',
  fiambres = 'Fiambres',
  frituras = 'Frituras',
}

enum HidratacionType {
  agua = 'Agua',
  bebidasEdulcoradas = 'Bebidas Edulcoradas',
}

enum InfusionesType {
  te = 'Té',
  mateCocido = 'Mate Cocido',
  otras = 'Otras',
}

enum CantidadComidasType {
  cuatro = '4',
  mayorA4 = 'Mayor a 4',
  menorA4 = 'Menor a 4',
  picoteo = 'Picoteo',
}

enum HsPantallaType {
  menorA2hs = 'Menor a 2hs',
  entre2hsY4hs = 'Entre 2hs y 4hs',
  masDe6hs = 'Más de 6hs',
}

enum HsAireLibreType {
  menosDe1h = 'Menos de 1h',
  unaHora = '1h',
  masDe1h = 'Más de 1h',
}

enum HsSuenioType {
  menosDe10hs = 'Menos de 10hs',
  entre10hsY12hs = 'Entre 10hs y 12hs',
  masDe13hs = 'Más de 13hs',
}

export const ClinicaFactory = setSeederFactory(Clinica, async () => {
  const clinica = new Clinica();
  clinica.es_clinica = Math.random() > 0.5 ? true : false;
  clinica.diabetes = clinica.es_clinica ? (Math.random() > 0.5 ? true : false) : null;
  clinica.hta = clinica.es_clinica ? (Math.random() > 0.5 ? true : false) : null;
  clinica.obesidad = clinica.es_clinica ? (Math.random() > 0.5 ? true : false) : null;
  clinica.consumo_alcohol = clinica.es_clinica ? (Math.random() > 0.5 ? true : false) : null;
  clinica.consumo_drogas = clinica.es_clinica ? (Math.random() > 0.5 ? true : false) : null;
  clinica.consumo_tabaco = clinica.es_clinica ? (Math.random() > 0.5 ? true : false) : null;
  clinica.antecedentes_perinatal = clinica.es_clinica ? (Math.random() > 0.5 ? true : false) : null;
  clinica.enfermedades_previas = clinica.es_clinica ? (Math.random() > 0.5 ? true : false) : null;
  clinica.leche = clinica.es_clinica ? (Math.random() > 0.5 ? true : false) : null;
  clinica.segto = Math.random() > 0.5 ? true : false;
  clinica.peso = faker.number.float({ min: 15, max: 70, fractionDigits: 2 });
  clinica.talla = faker.number.float({ min: 90, max: 140, fractionDigits: 2 });
  clinica.cc = faker.number.float({ min: 35, max: 110, fractionDigits: 2 });
  clinica.pct = faker.number.int({ min: 1, max: 99 });
  clinica.pcimc = faker.number.int({ min: 1, max: 99 });
  clinica.tas = clinica.es_clinica ? faker.number.int({ min: 70, max: 130 }) : null;
  clinica.tad = clinica.es_clinica ? faker.number.int({ min: 40, max: 120 }) : null;
  clinica.pcta = clinica.es_clinica ? faker.number.int({ min: 50, max: 99 }) : null;
  clinica.imc = clinica.peso / ((clinica.talla / 100) * (clinica.talla / 100));
  clinica.estado_nutricional = calcularEstadoNutricional(clinica.pcimc);
  clinica.tension_arterial = clinica.es_clinica ? calcularTensionArterial(clinica.pcta) : null;
  const vacunas = [VacunasType.completo, VacunasType.incompleto, VacunasType.desconocido];
  const examenVisualOptions = [ExamenVisualType.normal, ExamenVisualType.anormal];
  const ortopediaTraumatologiaOptions = [OrtopediaTraumatologiaType.normal, OrtopediaTraumatologiaType.escoliosis, OrtopediaTraumatologiaType.piePlano, OrtopediaTraumatologiaType.otras];
  const lenguajeOptions = [LenguajeType.adecuado, LenguajeType.inadecuado];
  const alimentacionOptions = [AlimentacionType.mixtaYVariada, AlimentacionType.ricaEnHdC, AlimentacionType.pobreEnFibras, AlimentacionType.fiambres, AlimentacionType.frituras];
  const hidratacionOptions = [HidratacionType.agua, HidratacionType.bebidasEdulcoradas];
  const infusionesOptions = [InfusionesType.te, InfusionesType.mateCocido, InfusionesType.otras];
  const cantidadComidasOptions = [CantidadComidasType.cuatro, CantidadComidasType.mayorA4, CantidadComidasType.menorA4, CantidadComidasType.picoteo];
  const hsPantallaOptions = [HsPantallaType.menorA2hs, HsPantallaType.entre2hsY4hs, HsPantallaType.masDe6hs];
  const hsAireLibreOptions = [HsAireLibreType.masDe1h, HsAireLibreType.menosDe1h, HsAireLibreType.unaHora];
  const hsSuenioOptions = [HsSuenioType.entre10hsY12hs, HsSuenioType.masDe13hs, HsSuenioType.menosDe10hs];
  clinica.vacunas = clinica.es_clinica ? vacunas[Math.floor(Math.random() * vacunas.length)] : null;
  clinica.examen_visual = clinica.es_clinica ? examenVisualOptions[Math.floor(Math.random() * examenVisualOptions.length)] : null;
  clinica.ortopedia_traumatologia = clinica.es_clinica ? ortopediaTraumatologiaOptions[Math.floor(Math.random() * ortopediaTraumatologiaOptions.length)] : null;
  clinica.lenguaje = clinica.es_clinica ? lenguajeOptions[Math.floor(Math.random() * lenguajeOptions.length)] : null;
  clinica.alimentacion = clinica.es_clinica ? alimentacionOptions[Math.floor(Math.random() * alimentacionOptions.length)] : null;
  clinica.hidratacion = clinica.es_clinica ? hidratacionOptions[Math.floor(Math.random() * hidratacionOptions.length)] : null;
  clinica.infusiones = clinica.es_clinica ? infusionesOptions[Math.floor(Math.random() * infusionesOptions.length)] : null;
  clinica.cantidad_comidas = clinica.es_clinica ? cantidadComidasOptions[Math.floor(Math.random() * cantidadComidasOptions.length)] : null;
  clinica.horas_pantalla = clinica.es_clinica ? hsPantallaOptions[Math.floor(Math.random() * hsPantallaOptions.length)] : null;
  clinica.horas_juego_aire_libre = clinica.es_clinica ? hsAireLibreOptions[Math.floor(Math.random() * hsAireLibreOptions.length)] : null;
  clinica.horas_suenio = clinica.es_clinica ? hsSuenioOptions[Math.floor(Math.random() * hsSuenioOptions.length)] : null;
  return clinica;
});

function calcularEstadoNutricional(pcimc: number) {
  if (pcimc < 4) return 'B Bajo peso/Desnutrido';
  if (pcimc >= 4 && pcimc < 10) return 'A Riesgo Nutricional';
  if (pcimc >= 10 && pcimc < 85) return 'C Eutrófico';
  if (pcimc >= 85 && pcimc < 95) return 'D Sobrepeso';
  if (pcimc >= 95) return 'E Obesidad';
  else return 'Sin clasificación';
}

function calcularTensionArterial(pcta: number) {
  if (pcta < 90) return 'Normotenso';
  if (pcta >= 90 && pcta < 95) return 'Riesgo';
  if (pcta >= 95) return 'Hipertenso';
  else return 'Sin clasificación';
}
