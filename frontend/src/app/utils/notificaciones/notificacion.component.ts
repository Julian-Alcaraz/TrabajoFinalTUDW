import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notificacion',
  template: `
    @if (data[0].length && data[0].length !== 0) {
      @for (item of data[0]; track $index) {
        <h5 style="text-align:center;" [innerHTML]="item"></h5>
      }
    } @else {
      <h5 style="text-align:center;" [innerHTML]="data[0]"></h5>
    }
  `,
})
export class NotificacionComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
