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
  piePlano = 'Pie plano',
  // otras = 'Otras',!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
  bebidasEdulcoradas = 'Bebidas edulcoradas',
}

enum InfusionesType {
  te = 'Té',
  mateCocido = 'Mate Cocido',
  //otras = 'Otras',!!!!!!!!!!!!!!!!!!!!!!
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
  masDe6hs = 'Mas de 6hs',
}

enum HsAireLibreType {
  menosDe1h = 'Menos de 1h',
  unaHora = '1h',
  masDe1h = 'Mas de 1h',
}

enum HsSuenioType {
  menosDe10hs = 'Menos de 10hs',
  entre10hsY12hs = 'Entre 10hs y 12hs',
  masDe13hs = 'Mas de 13hs',
}

export const ClinicaFactory = setSeederFactory(Clinica, async () => {
  const clinica = new Clinica();
  clinica.diabetes = Math.random() > 0.5 ? true : false;
  clinica.hta = Math.random() > 0.5 ? true : false;
  clinica.obesidad = Math.random() > 0.5 ? true : false;
  clinica.consumo_alcohol = Math.random() > 0.5 ? true : false;
  clinica.consumo_drogas = Math.random() > 0.5 ? true : false;
  clinica.consumo_tabaco = Math.random() > 0.5 ? true : false;
  clinica.antecedentes_perinatal = Math.random() > 0.5 ? true : false;
  clinica.enfermedades_previas = Math.random() > 0.5 ? true : false;
  clinica.peso = faker.number.float({ min: 15, max: 70, fractionDigits: 2 });
  clinica.talla = faker.number.float({ min: 90, max: 140, fractionDigits: 2 });
  clinica.cc = faker.number.float({ min: 35, max: 110, fractionDigits: 2 });
  clinica.pct = faker.number.int({ min: 10, max: 99 });
  clinica.imc = clinica.peso / ((clinica.talla / 100) * (clinica.talla / 100));
  clinica.pcimc = faker.number.int({ min: 10, max: 99 });
  clinica.tas = faker.number.int({ min: 70, max: 130 });
  clinica.tad = faker.number.int({ min: 40, max: 120 });
  clinica.pcta = faker.number.int({ min: 50, max: 99 });
  clinica.estado_nutricional = calcularEstadoNutricional(clinica.pcimc);
  clinica.tension_arterial = calcularTensionArterial(clinica.pcta);

  const vacunas = [VacunasType.completo, VacunasType.incompleto, VacunasType.desconocido];
  clinica.vacunas = vacunas[Math.floor(Math.random() * vacunas.length)];

  const examenVisualOptions = [ExamenVisualType.normal, ExamenVisualType.anormal];
  clinica.examen_visual = examenVisualOptions[Math.floor(Math.random() * examenVisualOptions.length)];

  const ortopediaTraumatologiaOptions = [OrtopediaTraumatologiaType.normal, OrtopediaTraumatologiaType.escoliosis, OrtopediaTraumatologiaType.piePlano];
  clinica.ortopedia_traumatologia = ortopediaTraumatologiaOptions[Math.floor(Math.random() * ortopediaTraumatologiaOptions.length)];

  const lenguajeOptions = [LenguajeType.adecuado, LenguajeType.inadecuado];
  clinica.lenguaje = lenguajeOptions[Math.floor(Math.random() * lenguajeOptions.length)];

  clinica.segto = Math.random() > 0.5 ? true : false;

  const alimentacionOptions = [AlimentacionType.mixtaYVariada, AlimentacionType.ricaEnHdC, AlimentacionType.pobreEnFibras, AlimentacionType.fiambres, AlimentacionType.frituras];
  clinica.alimentacion = alimentacionOptions[Math.floor(Math.random() * alimentacionOptions.length)];

  const hidratacionOptions = [HidratacionType.agua, HidratacionType.bebidasEdulcoradas];
  clinica.hidratacion = hidratacionOptions[Math.floor(Math.random() * hidratacionOptions.length)];

  clinica.leche = Math.random() > 0.5 ? true : false;

  const infusionesOptions = [InfusionesType.te, InfusionesType.mateCocido];
  clinica.infusiones = infusionesOptions[Math.floor(Math.random() * infusionesOptions.length)];

  const cantidadComidasOptions = [CantidadComidasType.cuatro, CantidadComidasType.mayorA4, CantidadComidasType.menorA4, CantidadComidasType.picoteo];
  clinica.cantidad_comidas = cantidadComidasOptions[Math.floor(Math.random() * cantidadComidasOptions.length)];

  const hsPantallaOptions = [HsPantallaType.menorA2hs, HsPantallaType.entre2hsY4hs, HsPantallaType.masDe6hs];
  clinica.horas_pantalla = hsPantallaOptions[Math.floor(Math.random() * hsPantallaOptions.length)];

  const hsAireLibreOptions = [HsAireLibreType.masDe1h, HsAireLibreType.menosDe1h, HsAireLibreType.unaHora];
  clinica.horas_juego_aire_libre = hsAireLibreOptions[Math.floor(Math.random() * hsAireLibreOptions.length)];

  const hsSuenioOptions = [HsSuenioType.entre10hsY12hs, HsSuenioType.masDe13hs, HsSuenioType.menosDe10hs];
  clinica.horas_suenio = hsSuenioOptions[Math.floor(Math.random() * hsSuenioOptions.length)];

  return clinica;
});

function calcularEstadoNutricional(pcimc: number) {
  if (pcimc < 4) return 'B Bajo peso/Desnutrido';
  if (pcimc >= 4 && pcimc < 10) return 'A Riesgo Nutricional';
  if (pcimc >= 10 && pcimc < 85) return 'C Eutrófico';
  if (pcimc >= 85 && pcimc < 95) return 'D Sobrepeso';
  if (pcimc >= 95) return 'E Obesidad';
  else return 'Sin clasificacion';
}

function calcularTensionArterial(pcta: number) {
  if (pcta < 90) return 'Normotenso';
  if (pcta >= 90 && pcta < 95) return 'Riesgo';
  if (pcta >= 95) return 'Hipertenso';
  else return 'Sin clasificacion';
}
