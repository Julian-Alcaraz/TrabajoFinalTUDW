import { Component, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-pie-graph',
  standalone: true,
  imports: [ChartModule],
  template: `
    <h2 class="text-center text-2xl">{{ titulo }}</h2>
    <div class="flex justify-center">
      <p-chart class="w-4/6" type="pie" [data]="data" [options]="options" />
    </div>
    <p class="flex float-end mr-2">Total : {{total}}</p>
    <!-- <p-chart type="bar" class="w-full" [data]="basicData" [options]="basicOptions" /> -->
  `,
})
export class PieGraphComponent implements OnInit {
  @Input() titulo = 'Titulo no definido';
  @Input() labels: any[] = ['A', 'B', 'C'];
  @Input() set ={ label: '', data: [0] };
  textColor = "#0000000";
  total=0;
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
  ];

  ngOnInit() {
    this.calcularTotal()
    this.data = {
      labels:this.labels,
      datasets: [
        {
          label:this.set.label,
          data: this.set.data,
          backgroundColor: [this.pieColors[0].background, this.pieColors[1].background, this.pieColors[2].background],
          hoverBackgroundColor: [this.pieColors[0].border, this.pieColors[1].border, this.pieColors[2].border],
        },
        // {
        //   data: [100, 50, 702],
        //   backgroundColor: [this.pieColors[0].background, this.pieColors[1].background, this.pieColors[2].background],
        //   hoverBackgroundColor: [this.pieColors[0].border, this.pieColors[1].border, this.pieColors[2].border],
        // },
      ],
    };
  }
  calcularTotal(){
    // this.total= this.data
  }

}
