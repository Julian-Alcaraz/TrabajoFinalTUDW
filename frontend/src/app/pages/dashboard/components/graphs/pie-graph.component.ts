import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-pie-graph',
  standalone: true,
  imports: [ChartModule],
  template: `
    <h1 class="text-center text-2xl">{{ titulo }}</h1>
    <h2 class="text-center text-lg">{{ subTitulo }}</h2>
    <div class="flex justify-center">
      <p-chart class="w-4/6" type="pie" [data]="data" [options]="options" />
    </div>
    <p class="flex float-end mr-2">Total : {{ total }}</p>
  `,
})
export class PieGraphComponent implements OnInit, OnChanges {
  @Input() titulo = 'Titulo no definido';
  @Input() subTitulo = '';
  @Input() labels: any[] = ['A', 'B', 'C'];
  @Input() set = { label: '', data: [0] };
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
        // {
        //   data: [100, 50, 702],
        //   backgroundColor: [this.pieColors[0].background, this.pieColors[1].background, this.pieColors[2].background],
        //   hoverBackgroundColor: [this.pieColors[0].border, this.pieColors[1].border, this.pieColors[2].border],
        // },
      ],
    };
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.set.data.reduce((sum, value) => sum + value, 0);
  }
}
