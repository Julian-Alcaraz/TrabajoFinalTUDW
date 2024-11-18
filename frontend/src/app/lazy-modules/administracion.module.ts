import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { GestionarLocalidadesComponent } from '../pages/administracion/gestionar-localidades/gestionar-localidades.component';
import { NuevoUsuarioComponent } from '../pages/administracion/usuarios/nuevo-usuario/nuevo-usuario.component';
import { ListaUsuarioComponent } from '../pages/administracion/usuarios/lista-usuario/lista-usuario.component';
import { adminGuard } from '../guards/auth.guard';
import { GestionarBarriosComponent } from '../pages/administracion/gestionar-barrios/gestionar-barrios.component';

const routes: Routes = [
  {
    path: 'gestionarLocalidades',
    children: [
      { path: '', component: GestionarLocalidadesComponent, canActivate: [adminGuard] },
    ],
  },
  {
    path: 'gestionarBarrios',
    children: [
      { path: '', component: GestionarBarriosComponent, canActivate: [adminGuard] },
    ],
  },
  {
    path: 'usuarios',
    children: [
      { path: 'nuevo', component: NuevoUsuarioComponent, canActivate: [adminGuard] },
      { path: 'list', component: ListaUsuarioComponent, canActivate: [adminGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracionModule {}
