import { faker } from '@faker-js/faker/locale/es';
import { setSeederFactory } from 'typeorm-extension';

import { Fonoaudiologia } from '../../consulta/entities/fonoaudiologia.entity';

enum CausasType {
  prenatal = 'Prenatal',
  postnatal = 'Postnatal',
  acv = 'Acv',
  respiratorias = 'Respiratorias',
  audicion = 'Audicion',
  patologiasClinicas = 'Patologias clinicas',
  sindromes = 'Sindromes',
  inflamacionAmigdalasAdenoides = 'Inflamacion de amigdalas o adenoides',
  prematurez = 'Prematurez',
  otras = 'Otras',
}

enum DiagPresuntivoType {
  tel = 'Tel',
  tea = 'Tea',
  retraso_lenguaje_dislalias_funcionales = 'Retraso en el lenguaje dislalias funcionales',
  respirador_bucal = 'Respirador bucal',
  aniquilogosia = 'Aniquilogosia',
  ortodoncia_protusion_lingual_paladar_hendido = 'Ortodoncia: Protusion lingual, paladar hendido',
  sindromes = 'Sindromes',
  otras_patologias_dificulten_lenguaje_comunicacion = 'Otras patologias que dificulten el lenguaje y la comunicacion',
}

export const FonoaudiologiaFactory = setSeederFactory(Fonoaudiologia, async () => {
  const fonoaudiologia = new Fonoaudiologia();
  fonoaudiologia.asistencia = Math.random() > 0.5 ? true : false;

  const causasOptions = [CausasType.prenatal, CausasType.postnatal, CausasType.acv, CausasType.respiratorias, CausasType.audicion, CausasType.patologiasClinicas, CausasType.sindromes, CausasType.inflamacionAmigdalasAdenoides, CausasType.prematurez, CausasType.otras];
  fonoaudiologia.causas = causasOptions[Math.floor(Math.random() * causasOptions.length)];

  const diagPresuntivoOptions = [DiagPresuntivoType.tel, DiagPresuntivoType.tea, DiagPresuntivoType.retraso_lenguaje_dislalias_funcionales, DiagPresuntivoType.respirador_bucal, DiagPresuntivoType.aniquilogosia, DiagPresuntivoType.ortodoncia_protusion_lingual_paladar_hendido, DiagPresuntivoType.sindromes, DiagPresuntivoType.otras_patologias_dificulten_lenguaje_comunicacion];

  fonoaudiologia.diagnostico_presuntivo = diagPresuntivoOptions[Math.floor(Math.random() * diagPresuntivoOptions.length)];

  return fonoaudiologia;
});
