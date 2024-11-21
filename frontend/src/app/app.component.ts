import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PrimeNGConfig } from 'primeng/api';
import { Aura } from 'primeng/themes/aura';
import { definePreset, palette } from 'primeng/themes';
// import { Lara } from 'primeng/themes/lara';
// import { Nora } from 'primeng/themes/nora';

// const MyPreset = definePreset(Aura, {
//   semantic: {
//     primary: {
//       blue: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' },
//     },
//   },
// });

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Fundación Sol';

  // validar si existe la session
  constructor(private primengConfig: PrimeNGConfig) {
    this.primengConfig.theme.set({
      //preset: Aura,
      preset: definePreset(Aura, {
        semantic: { primary: palette('{blue}') },
      }),
      options: {
        prefix: 'p',
        darkModeSelector: '.my-app-dark',
        cssLayer: false,
      },
    });
  }
  ngOnInit() {
    this.primengConfig.ripple.set(true);
  }
}
