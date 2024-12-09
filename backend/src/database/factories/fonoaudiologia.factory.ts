import { faker } from '@faker-js/faker/locale/es';
import { setSeederFactory } from 'typeorm-extension';

import { Fonoaudiologia } from '../../consulta/entities/fonoaudiologia.entity';

enum CausasType {
  prenatal = 'Prenatal',
  postnatal = 'Postnatal',
  acv = 'ACV',
  respiratorias = 'Respiratorias',
  audicion = 'Audición',
  patologias_clinicas = 'Patologías clínicas',
  sindromes = 'Síndromes',
  inflamacion_amigdalas_adenoides = 'Inflamación de amígdalas o adenoides',
  prematurez = 'Prematurez',
  otras = 'Otras',
}

enum DiagPresuntivoType {
  tel = 'TEL',
  tea = 'TEA',
  retraso_lenguaje_dislalias_funcionales = 'Retraso en el lenguaje, dislalias funcionales',
  respirador_bucal = 'Respirador bucal',
  anquiloglosia = 'Anquiloglosia',
  ortodoncia_protrusion_lingual_paladar_hendido = 'Ortodoncia: Protrusión lingual, paladar hendido',
  sindromes = 'Síndromes',
  otras_patologias_dificulten_lenguaje_comunicacion = 'Otras patologías que dificulten el lenguaje y la comunicación',
}

export const FonoaudiologiaFactory = setSeederFactory(Fonoaudiologia, async () => {
  const fonoaudiologia = new Fonoaudiologia();
  fonoaudiologia.asistencia = Math.random() > 0.5 ? true : false;

  const causasOptions = [CausasType.prenatal, CausasType.postnatal, CausasType.acv, CausasType.respiratorias, CausasType.audicion, CausasType.patologias_clinicas, CausasType.sindromes, CausasType.inflamacion_amigdalas_adenoides, CausasType.prematurez, CausasType.otras];
  fonoaudiologia.causas = causasOptions[Math.floor(Math.random() * causasOptions.length)];

  const diagPresuntivoOptions = [DiagPresuntivoType.tel, DiagPresuntivoType.tea, DiagPresuntivoType.retraso_lenguaje_dislalias_funcionales, DiagPresuntivoType.respirador_bucal, DiagPresuntivoType.anquiloglosia, DiagPresuntivoType.ortodoncia_protrusion_lingual_paladar_hendido, DiagPresuntivoType.sindromes, DiagPresuntivoType.otras_patologias_dificulten_lenguaje_comunicacion];

  fonoaudiologia.diagnostico_presuntivo = diagPresuntivoOptions[Math.floor(Math.random() * diagPresuntivoOptions.length)];

  return fonoaudiologia;
});
