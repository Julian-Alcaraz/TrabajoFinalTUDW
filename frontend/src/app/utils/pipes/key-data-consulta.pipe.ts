import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyDataConsulta',
  standalone: true,
})
export class KeyDataConsultaPipe implements PipeTransform {
  // , ...args: unknown[]
  transform(value: unknown): string {
    if (typeof value == 'string') value = value.replace(/_/g, ' ');
    return String(value);
  }
}
