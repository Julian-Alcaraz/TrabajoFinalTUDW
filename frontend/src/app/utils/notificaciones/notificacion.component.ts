import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notificacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!isString) {
      @for (item of data[0]; track $index) {
        <h5 style="text-align:center;" [innerHTML]="item"></h5>
      }
    } @else {
      <h5 style="text-align:center;" [innerHTML]="data[0]"></h5>
    }
  `,
})
export class NotificacionComponent {
  isString = false;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.isString = typeof data[0] === 'string' ? true : false;
  }
}
