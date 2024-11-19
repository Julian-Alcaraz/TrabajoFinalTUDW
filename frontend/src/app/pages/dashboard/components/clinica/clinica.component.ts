import { Component } from '@angular/core';
import { PieGraphComponent } from '../graphs/pie-graph.component';
import { BarGraphComponent } from "../graphs/bar-graph.component";
import { CommonModule } from '@angular/common';
import { YearGradoFormComponent } from '../year-grado-form/year-grado-form.component';

@Component({
  selector: 'app-clinica',
  standalone: true,
  imports: [CommonModule, PieGraphComponent, BarGraphComponent, YearGradoFormComponent ],
  templateUrl: './clinica.component.html',
  styleUrl: './clinica.component.css'
})
export class ClinicaComponent {

}
