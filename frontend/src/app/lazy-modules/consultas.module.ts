import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NuevaClinicaComponent } from '@pages/consultas/clinica/nueva-clinica/nueva-clinica.component';
import { NuevaOftalmologiaComponent } from '@pages/consultas/oftalmologia/nueva-oftalmologia/nueva-oftalmologia.component';
import { NuevaOdontologiaComponent } from '@pages/consultas/odontologia/nueva-odontologia/nueva-odontologia.component';
import { NuevaFonoaudiologicaComponent } from '@pages/consultas/fonoaudiologia/nueva-fonoaudiologia/nueva-fonoaudiologia.component';
import { BusquedasComponent } from '@pages/busquedas/busquedas.component';
import { profesionalGuard } from '../guards/auth.guard';
import { NuevaPrevencionComponent } from '@app/pages/consultas/prevencion/nueva-prevencion/nueva-prevencion.component';
import { NuevaSocialComponent } from '@app/pages/consultas/social/nueva-social/nueva-social.component';

const routes: Routes = [
  { path: 'busqueda', component: BusquedasComponent },
  { path: 'clinica/nueva', component: NuevaClinicaComponent, canActivate: [profesionalGuard] },
  { path: 'oftalmologia/nueva', component: NuevaOftalmologiaComponent, canActivate: [profesionalGuard] },
  { path: 'odontologia/nueva', component: NuevaOdontologiaComponent, canActivate: [profesionalGuard] },
  { path: 'fonoaudiologia/nueva', component: NuevaFonoaudiologicaComponent, canActivate: [profesionalGuard] },
  { path: 'prevencion/nueva', component: NuevaPrevencionComponent, canActivate: [profesionalGuard] },
  { path: 'social/nueva', component: NuevaSocialComponent, canActivate: [profesionalGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultasModule {}
