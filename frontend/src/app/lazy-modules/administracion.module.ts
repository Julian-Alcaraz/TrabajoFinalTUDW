import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LocalidadesComponent } from '../pages/administracion/localidades/localidades.component';
import { NuevoUsuarioComponent } from '../pages/administracion/usuarios/nuevo-usuario/nuevo-usuario.component';
import { ListaUsuarioComponent } from '../pages/administracion/usuarios/lista-usuario/lista-usuario.component';
import { adminGuard } from '../guards/auth.guard';
import { BarriosComponent } from '../pages/administracion/barrios/barrios.component';
import { InstitucionesComponent } from '../pages/administracion/instituciones/instituciones.component';
import { CursosComponent } from '../pages/administracion/cursos/cursos.component';

const routes: Routes = [
  {
    path: 'localidades',
    children: [{ path: '', component: LocalidadesComponent, canActivate: [adminGuard] }],
  },
  {
    path: 'barrios',
    children: [{ path: '', component: BarriosComponent, canActivate: [adminGuard] }],
  },
  {
    path: 'instituciones',
    children: [{ path: '', component: InstitucionesComponent, canActivate: [adminGuard] }],
  },
  {
    path: 'cursos',
    children: [{ path: '', component: CursosComponent, canActivate: [adminGuard] }],
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
