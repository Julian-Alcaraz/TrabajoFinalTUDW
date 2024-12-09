import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { LoadingComponent } from '@components/loading/loading.component';
@Component({
  selector: 'app-bar-graph',
  standalone: true,
  imports: [ChartModule, CommonModule, LoadingComponent],
  template: `
    <div class="flex flex-col h-full text-center">
      <h1 class=" text-2xl">{{ titulo }}</h1>
      <h2 class=" text-lg">{{ subTitulo }}</h2>
      <div class="flex-grow">
        <p-chart *ngIf="sets.length" type="bar" class="w-full" [data]="basicData" [options]="basicOptions"></p-chart>
        <div *ngIf="!sets.length" class="w-full flex justify-center items-center min-h-full">
          <div *ngIf="!loading">
            No se encontró información <br />
            No es posible generar el gráfico.
          </div>
          <div *ngIf="loading">
            <app-loading />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BarGraphComponent implements OnInit, OnChanges {
  @Input() loading = false;
  @Input() titulo = 'Titulo no definido';
  @Input() subTitulo = '';
  @Input() labels: any[] = ['Q1', 'Q2', 'Q3', 'Q4'];
  @Input() porcentaje = false;
  @Input() sets = [
    { label: '', data: [0] },
    { label: '', data: [0] },
  ];
  basicData: any;

  textColor = '#00000';
  textColorSecondary = '#000000';
  surfaceBorder = '#d1d1d1';
  barColors = [
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
  ];

  basicOptions = {
    plugins: {
      legend: { labels: { color: this.textColor } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: this.textColorSecondary,
          callback: (value: number) => (this.porcentaje ? value + '%' : value),
          stepSize: this.porcentaje ? 10 : undefined,
        },
        max: this.porcentaje ? 100 : undefined,
        grid: {
          color: this.surfaceBorder,
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          color: this.textColorSecondary,
        },
        grid: {
          color: this.surfaceBorder,
          drawBorder: false,
        },
      },
    },
  };

  ngOnInit() {
    this.actualizarSets();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sets']) {
      this.sets = changes['sets'].currentValue;
      this.actualizarSets();
    }
  }
  actualizarSets() {
    const datasets = [];
    let color = 0;
    for (const set of this.sets) {
      datasets.push({
        label: set.label,
        data: set.data,
        backgroundColor: this.barColors[color].background,
        borderColor: this.barColors[color].border,
        borderWidth: 1,
      });
      color++;
    }

    this.basicData = {
      labels: this.labels,
      datasets: datasets,
    };
  }
}
