import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { adminGuard } from '../guards/auth.guard';
import { MiUsuarioComponent } from '../pages/usuarios/mi-usuario/mi-usuario.component';
//import { NuevoUsuarioComponent } from '../pages/administracion/usuarios/nuevo-usuario/nuevo-usuario.component';
//import { ListaUsuarioComponent } from '../pages/administracion/usuarios/lista-usuario/lista-usuario.component';

const routes: Routes = [
  { path: 'miUsuario', component: MiUsuarioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosModule {}
