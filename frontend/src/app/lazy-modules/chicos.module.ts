import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NuevoChicoComponent } from '../pages/chicos/nuevo-chico/nuevo-chico.component';
import { ListaChicoComponent } from '../pages/chicos/lista-chico/lista-chico.component';
import { VerChicoComponent } from '../pages/chicos/ver-chico/ver-chico.component';
import { EditarChicoComponent } from '../pages/chicos/editar-chico/editar-chico.component';
import { adminGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: 'nuevo', component: NuevoChicoComponent },
  { path: 'list', component: ListaChicoComponent },
  { path: 'ver/:id', component: VerChicoComponent },
  { path: 'editar/:id', component: EditarChicoComponent, canActivate: [adminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChicosModule {}
