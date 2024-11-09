import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BusquedasComponent } from '../pages/busquedas/busquedas.component';

const routes: Routes = [
  { path: '', component: BusquedasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusquedasModule {}
