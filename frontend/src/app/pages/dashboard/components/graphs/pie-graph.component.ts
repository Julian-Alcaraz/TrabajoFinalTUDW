import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { LoadingComponent } from '../../../../components/loading/loading.component';

@Component({
  selector: 'app-pie-graph',
  standalone: true,
  imports: [ChartModule, CommonModule, LoadingComponent],
  template: `
    <div class="flex flex-col h-full text-center">
      <h1 class=" text-2xl">{{ titulo }}</h1>
      <h2 class=" text-lg">{{ subTitulo }}</h2>
      <div class="flex-grow flex justify-center items-center">
        <p-chart *ngIf="set.data.length" class="w-4/6" type="pie" [data]="data" [options]="options" />
        <div *ngIf="!set.data.length" class="w-full flex justify-center items-center min-h-full">
          <div *ngIf="!loading">
            No se encontró información <br />
            No es posible generar el gráfico.
          </div>
          <div *ngIf="loading">
            <app-loading />
          </div>
        </div>
      </div>
      <p *ngIf="set.data.length">Total : {{ total }}</p>
    </div>
  `,
})
export class PieGraphComponent implements OnInit, OnChanges {
  @Input() loading = false;
  @Input() titulo = 'Titulo no definido';
  @Input() subTitulo = '';
  @Input() labels: any[] = ['A', 'B', 'C'];
  @Input() set = { label: '', data: [] };
  textColor = '#0000000';
  total = 0;
  data: any;
  options = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: this.textColor,
        },
      },
    },
  };
  pieColors = [
    {
      background: 'rgba(255, 159, 64, 0.6)',
      border: 'rgb(255, 159, 64)',
    },
    {
      background: 'rgba(75, 192, 192, 0.6)',
      border: 'rgb(75, 192, 192)',
    },
    {
      background: 'rgba(54, 162, 235, 0.6)',
      border: 'rgb(54, 162, 235)',
    },
    {
      background: 'rgba(153, 102, 255, 0.6)',
      border: 'rgba(153, 102, 255)',
    },
    {
      background: 'rgba(255, 206, 86, 0.6)',
      border: 'rgb(255, 206, 86)',
    },
    {
      background: 'rgba(231, 76, 60, 0.6)',
      border: 'rgb(231, 76, 60)',
    },
  ];
  backgroundColors = this.pieColors.map((color) => color.background);
  hoverBackgroundColors = this.pieColors.map((color) => color.border);
  ngOnInit() {
    this.actualizarSets();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['set']) {
      this.set = changes['set'].currentValue;
      this.actualizarSets();
    }
  }

  actualizarSets() {
    this.data = {
      labels: this.labels,
      datasets: [
        {
          label: this.set.label,
          data: this.set.data,
          backgroundColor: this.backgroundColors,
          hoverBackgroundColor: this.hoverBackgroundColors,
        },
      ],
    };
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.set.data.reduce((sum, value) => sum + value, 0);
  }
}
