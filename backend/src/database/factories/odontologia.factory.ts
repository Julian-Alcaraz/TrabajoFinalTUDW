import { faker } from '@faker-js/faker/locale/es';
import { setSeederFactory } from 'typeorm-extension';

import { Odontologia } from '../../consulta/entities/odontologia.entity';

export const OdontologiaFactory = setSeederFactory(Odontologia, async () => {
  const odontologia = new Odontologia();
  odontologia.cepillo = Math.random() > 0.5 ? true : false;
  const habitosDentales = [
    'ONICOFAGIA Y SUCCION DIGITAL',
    'SI',
    'SE COME LAS UÑAS',
    'CONSUME MUCHA CANTIDAD DE AZUCAR',
    'SE COME LAS UÑAS',
    'NO',
    'Toma mamadera. No se alimenta correctamente. (solo consume cosas que puede comer con la mano)',
    'Tomo mamadera mucho tiempo',
    'Uso de mamadera',
    'Mamadera',
    'Toma teta y mamadera aun',
    'Usa mamadera en la casa del padre',
    'HABLA CON Z, RICA EN H DE C',
    '61 NECROSADO, TOMO TETA HASTA LOS  AÑOS, DUERME CON LECHE CHOCOLATADA O TE CON AZUCAR',
    'Se golpio dientes 81,82,71 y 72. con movilidad',
    'POCO CEPILLADO , CONSUME BEBIDAS AZUCARADAS, TIENE MAS DE 5 MOMENTOS DE AZUCAR',
    'Consume mucha cantidad de chocolate y comidas azucaradas',
    'Cepilla sus dientes 1 a 2 veces opr dia sola',
    'Esta haciendo tratamiento pdpntologico. cepilla sus dientes todos los dias. una mamadera todas las noches con leche y azucar',
    'Come muchas golosinas. cepilla una vez al dia sus dientes sola',
    'Onicofagia. No se dejo atender',
    'Come muchas golosinas',
    'Toma mamadera todas las noches con leche con azucar y chocolate. Cepilla una sola vez los dientes despues del almuerzo',
  ];
  odontologia.habitos = faker.helpers.arrayElement(habitosDentales);
  odontologia.dientes_irecuperables = faker.number.int({ min: 0, max: 14 });
  odontologia.dientes_recuperables = faker.number.int({ min: 0, max: 7 });
  odontologia.clasificacion = clasificacionDental(odontologia.dientes_recuperables, odontologia.dientes_irecuperables);
  odontologia.cepillado = Math.random() > 0.5 ? true : false;
  odontologia.topificacion = Math.random() > 0.5 ? true : false;
  odontologia.sellador = faker.number.int({ min: 4, max: 10 });
  odontologia.dientes_temporales = faker.number.int({ min: 10, max: 20 });
  odontologia.dientes_permanentes = faker.number.int({ min: 0, max: 12 });
  odontologia.primera_vez = Math.random() > 0.5 ? true : false;
  if (odontologia.primera_vez === true) odontologia.ulterior = false;
  else odontologia.ulterior = true
  return odontologia;
});

function clasificacionDental(dR: number, dIr: number) {
  if (dR == 0 && dIr == 0) return 'Boca sana';
  else if (dR <= 4 && dIr == 0) return 'Bajo índice de caries';
  else if (dIr == 1) return 'Moderado índice de caries';
  else if (dIr > 1) return 'Alto índice de caries';
  else return 'Sin clasificación';
}