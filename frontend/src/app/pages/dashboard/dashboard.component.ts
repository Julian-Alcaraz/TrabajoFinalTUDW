import { Component } from '@angular/core';
import { GeneralComponent } from './general/general.component';
import { TabsComponent } from '../../components/tabs/tabs.component';
import { ClinicaComponent } from './clinica/clinica.component';
import { FonoaudiologiaComponent } from './fonoaudiologia/fonoaudiologia.component';
import { OdontologiaComponent } from './odontologia/odontologia.component';
import { OftalmologiaComponent } from './oftalmologia/oftalmologia.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GeneralComponent, TabsComponent, ClinicaComponent, FonoaudiologiaComponent, OdontologiaComponent, OftalmologiaComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  currentParam: number | null = null;

  escucharParam(value: number) {
    this.currentParam = value;
  }
}
