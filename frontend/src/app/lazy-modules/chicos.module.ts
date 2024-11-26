import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NuevoChicoComponent } from '../pages/chicos/nuevo-chico/nuevo-chico.component';

import { VerChicoComponent } from '../pages/chicos/ver-chico/ver-chico.component';
import { ListaChicoComponent } from '../pages/chicos/lista-chico/lista-chico.component';
import { profesionalGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: 'nuevo', component: NuevoChicoComponent, canActivate:[profesionalGuard]},
  { path: 'list', component: ListaChicoComponent },
  { path: 'ver/:id', component: VerChicoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChicosModule {}
