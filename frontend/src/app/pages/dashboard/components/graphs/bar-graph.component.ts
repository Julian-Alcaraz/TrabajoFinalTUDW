import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'app-bar-graph',
  standalone: true,
  imports: [ChartModule],
  template: `
    <h2 class="text-center text-2xl">{{ titulo }}</h2>
    <p-chart type="bar" class="w-full" [data]="basicData" [options]="basicOptions" />
  `,
})
export class BarGraphComponent implements OnInit, OnChanges {
  @Input() titulo = 'Titulo no definido';
  @Input() labels: any[] = ['Q1', 'Q2', 'Q3', 'Q4'];
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
      legend: {
        labels: {
          color: this.textColor,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: this.textColorSecondary,
        },
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
    console.log('SET', this.sets);
    this.actualizarSets();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sets']) {
      console.log('Sets has changed:', changes['sets'].currentValue);
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
