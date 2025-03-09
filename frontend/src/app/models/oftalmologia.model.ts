import { DemandaType } from '@app/common/const/const';

export class Oftalmologia {
  constructor(
    public id: number,
    public demanda: DemandaType,
    public primera_vez: boolean,
    public control: boolean,
    public receta: boolean,
    public anteojos: boolean,
    public prox_control: Date,
  ) {}

  static overload_constructor() {
    return new Oftalmologia(0, 'Otro', false, false, false, false, new Date('2000-12-10'));
  }
}
