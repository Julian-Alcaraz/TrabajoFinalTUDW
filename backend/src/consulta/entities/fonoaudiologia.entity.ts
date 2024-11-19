import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Consulta } from './consulta.entity';

export type DiagnosticoPresuntivoType = 'TEL' | 'TEA' | 'Retraso en el lenguaje, dislalias funcionales' | 'Respirador bucal' | 'Anquiloglosia' | 'Ortodoncia: Protrusión lingual, paladar hendido' | 'Síndromes' | 'Otras patologías que dificulten el lenguaje y la comunicación';
export type CausasType = 'Prenatal' | 'Postnatal' | 'ACV' | 'Respiratorias' | 'Audición' | 'Patologías clínicas' | 'Síndromes' | 'Inflamación de amígdalas o adenoides' | 'Prematurez' | 'Otras';

@Entity('fonoaudiologia')
export class Fonoaudiologia {
  @PrimaryColumn({ type: 'int' })
  id_consulta: number;

  @OneToOne(() => Consulta, (consulta) => consulta.fonoaudiologia)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consulta;

  // Datos Fonoaudiologia

  @Column({ type: 'boolean' })
  asistencia: boolean;

  @Column({ type: 'enum', enum: ['TEL', 'TEA', 'Retraso en el lenguaje, dislalias funcionales', 'Respirador bucal', 'Anquiloglosia', 'Ortodoncia: Protrusión lingual, paladar hendido', 'Síndromes', 'Otras patologías que dificulten el lenguaje y la comunicación'] })
  diagnostico_presuntivo: DiagnosticoPresuntivoType;

  @Column({ type: 'enum', enum: ['Prenatal', 'Postnatal', 'ACV', 'Respiratorias', 'Audición', 'Patologías clínicas', 'Síndromes', 'Inflamación de amígdalas o adenoides', 'Prematurez', 'Otras'] })
  causas: CausasType;
}
