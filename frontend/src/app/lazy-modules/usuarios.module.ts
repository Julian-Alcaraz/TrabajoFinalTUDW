import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MiUsuarioComponent } from '@pages/usuarios/mi-usuario/mi-usuario.component';

const routes: Routes = [{ path: '', component: MiUsuarioComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosModule {}
