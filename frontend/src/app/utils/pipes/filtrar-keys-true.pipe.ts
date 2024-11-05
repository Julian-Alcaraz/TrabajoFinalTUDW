import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarKeysTrue',
  standalone: true,
})
export class FiltrarKeysTruePipe implements PipeTransform {
  transform(obj: any): string {
    if (obj) {
      const text = Object.entries(obj)
        .filter(([_, value]) => value === true) // Filtrar solo las claves con valor true
        .map(([key]) => key) // Obtener solo las claves
        .join(', '); // Unir las claves con una coma y un espacio
      if (text) {
        return text;
      } else {
        return '-';
      }
    } else {
      return '-';
    }
  }
}
