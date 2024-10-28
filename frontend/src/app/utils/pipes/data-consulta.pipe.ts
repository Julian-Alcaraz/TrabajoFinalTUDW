import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataConsulta',
  standalone: true,
})
export class DataConsultaPipe implements PipeTransform {
  // , ...args: unknown[]
  transform(value: unknown): unknown {
    if (typeof value == 'boolean') value = value ? 'Si' : 'No';
    if (value == null) value = '-';
    return value;
  }
}
