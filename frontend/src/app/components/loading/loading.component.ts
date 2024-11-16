import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `<mat-spinner />`,
})
export class LoadingComponent {}
