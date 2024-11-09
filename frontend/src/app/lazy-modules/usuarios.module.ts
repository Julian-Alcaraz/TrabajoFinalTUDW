import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { adminGuard } from '../guards/auth.guard';
import { MiUsuarioComponent } from '../pages/usuarios/mi-usuario/mi-usuario.component';
import { NuevoUsuarioComponent } from '../pages/usuarios/nuevo-usuario/nuevo-usuario.component';
import { ListaUsuarioComponent } from '../pages/usuarios/lista-usuario/lista-usuario.component';

const routes: Routes = [
  { path: 'miUsuario', component: MiUsuarioComponent },
  { path: 'nuevo', component: NuevoUsuarioComponent, canActivate: [adminGuard] },
  { path: 'list', component: ListaUsuarioComponent, canActivate: [adminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosModule {}
