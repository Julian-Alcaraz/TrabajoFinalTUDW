import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notificacion',
  template: '<h5 style="text-align:center; color: black;" [innerHTML]="data[0]"></h5>',
})
export class NotificacionComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
