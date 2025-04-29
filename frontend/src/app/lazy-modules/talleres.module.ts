import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NuevoTallerComponent } from '@app/pages/talleres/nuevo-taller/nuevo-taller.component';;
import { ListaTallerComponent } from '@app/pages/talleres/lista-taller/lista-taller.component';
import { profesionalGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: 'nuevo', component: NuevoTallerComponent, canActivate: [profesionalGuard] },
  { path: 'list', component: ListaTallerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChicosModule {}
