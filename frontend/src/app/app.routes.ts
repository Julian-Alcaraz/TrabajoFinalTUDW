import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { authGuard, loginGuard } from './guards/auth.guard';
/*
import { adminGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MiUsuarioComponent } from './pages/usuarios/mi-usuario/mi-usuario.component';
import { NuevoUsuarioComponent } from './pages/usuarios/nuevo-usuario/nuevo-usuario.component';
import { ListaUsuarioComponent } from './pages/usuarios/lista-usuario/lista-usuario.component';
import { NuevoChicoComponent } from './pages/chicos/nuevo-chico/nuevo-chico.component';
import { ListaChicoComponent } from './pages/chicos/lista-chico/lista-chico.component';
import { VerChicoComponent } from './pages/chicos/ver-chico/ver-chico.component';
import { NuevaClinicaComponent } from './pages/consultas/clinica/nueva-clinica/nueva-clinica.component';

import { NuevaOftalmologiaComponent } from './pages/consultas/oftalmologia/nueva-oftalmologia/nueva-oftalmologia.component';
import { NuevaFonoaudiologicaComponent } from './pages/consultas/fonoaudiologia/nueva-fonoaudiologia/nueva-fonoaudiologia.component';
import { NuevaOdontologiaComponent } from './pages/consultas/odontologia/nueva-odontologia/nueva-odontologia.component';
import { EditarChicoComponent } from './pages/chicos/editar-chico/editar-chico.component';
import { ListaComponent } from './pages/lista/lista.component';
import { BusquedasComponent } from './pages/busquedas/busquedas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'asda',component:LayoutComponent  },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] }, // authGuard
  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [] },
      { path: 'usuarios/miUsuario', component: MiUsuarioComponent, canActivate: [] },
      { path: 'usuarios/nuevo', component: NuevoUsuarioComponent, canActivate: [adminGuard] },
      { path: 'usuarios/list', component: ListaUsuarioComponent, canActivate: [adminGuard] },
      { path: 'chicos/nuevo', component: NuevoChicoComponent, canActivate: [] }, // Admin y medicos
      { path: 'chicos/list', component: ListaChicoComponent, canActivate: [] },
      { path: 'chicos/ver/:id', component: VerChicoComponent, canActivate: [] },
      { path: 'chicos/editar/:id', component: EditarChicoComponent, canActivate: [adminGuard] },
      { path: 'consultas/clinica/nueva', component: NuevaClinicaComponent, canActivate: [] },
      { path: 'consultas/oftalmologia/nueva', component: NuevaOftalmologiaComponent, canActivate: [] },
      { path: 'consultas/odontologia/nueva', component: NuevaOdontologiaComponent, canActivate: [] },
      { path: 'consultas/fonoaudiologia/nueva', component: NuevaFonoaudiologicaComponent, canActivate: [] },
      { path: 'lista', component: ListaComponent, canActivate: [] }, // Admin, Profesionales y Acceso Info
      { path: 'busqueda', component: BusquedasComponent, canActivate: [] }, // Admin, Profesionales y Acceso Info
    ],
  },
];
*/

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./lazy-modules/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./lazy-modules/usuarios.module').then((m) => m.UsuariosModule),
      },
      {
        path: 'chicos',
        loadChildren: () => import('./lazy-modules/chicos.module').then((m) => m.ChicosModule),
      },
      {
        path: 'consultas',
        loadChildren: () => import('./lazy-modules/consultas.module').then((m) => m.ConsultasModule),
      },
      {
        path: 'busqueda',
        loadChildren: () => import('./lazy-modules/busquedas.module').then((m) => m.BusquedasModule),
      },
    ],
  },
];

// { esto yo creo que sirve par ahacer lazy loading y en component pones el modulo
//   path: 'usuarios',
//   children: [
//     { path: '', redirectTo: '/usuarios/miUsuario', pathMatch: 'full' },
//     { path: 'usuarios/miUsuario', component: MiUsuarioComponent },
//     { path: 'usuarios/nuevo', component: NuevoUsuarioComponent },
//     { path: 'usuarios/list', component: ListaUsuarioComponent },
//   ],
// },
