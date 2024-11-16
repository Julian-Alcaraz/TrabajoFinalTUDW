import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NuevaLocalidadComponent } from '../pages/administracion/localidades/nueva-localidad/nueva-localidad.component';
import { NuevoBarrioComponent } from '../pages/administracion/barrios/nuevo-barrio/nuevo-barrio.component';
import { ListaBarrioComponent } from '../pages/administracion/barrios/lista-barrio/lista-barrio.component';
import { ListaLocalidadComponent } from '../pages/administracion/localidades/lista-localidad/lista-localidad.component';
import { NuevoUsuarioComponent } from '../pages/administracion/usuarios/nuevo-usuario/nuevo-usuario.component';
import { ListaUsuarioComponent } from '../pages/administracion/usuarios/lista-usuario/lista-usuario.component';
import { adminGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'localidades',
    children: [
      { path: 'nueva', component: NuevaLocalidadComponent, canActivate: [adminGuard] },
      { path: 'list', component: ListaLocalidadComponent, canActivate: [adminGuard] },
    ],
  },
  {
    path: 'barrios',
    children: [
      { path: 'nuevo', component: NuevoBarrioComponent, canActivate: [adminGuard] },
      { path: 'list', component: ListaBarrioComponent, canActivate: [adminGuard] },
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
