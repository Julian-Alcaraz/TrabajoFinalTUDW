import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { adminGuard, authGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MiUsuarioComponent } from './pages/usuarios/mi-usuario/mi-usuario.component';
import { NuevoUsuarioComponent } from './pages/usuarios/nuevo-usuario/nuevo-usuario.component';
import { ListaUsuarioComponent } from './pages/usuarios/lista-usuario/lista-usuario.component';
import { NuevoChicoComponent } from './pages/chicos/nuevo-chico/nuevo-chico.component';
import { ListaChicoComponent } from './pages/chicos/lista-chico/lista-chico.component';
import { VerChicoComponent } from './pages/chicos/ver-chico/ver-chico.component';
import { NuevaClinicaComponent } from './pages/consultas/clinica/nueva-clinica/nueva-clinica.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'asda',component:LayoutComponent  },
  { path: 'login', component: LoginComponent, canActivate: [] }, // authGuard
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
      { path: 'chicos/nuevo', component: NuevoChicoComponent, canActivate: [] }, // Esta ruta deberia ser accesible solo a los usuarios administradores o medicos, no para acceso-info
      { path: 'chicos/list', component: ListaChicoComponent, canActivate: [] },
      { path: 'chicos/:id', component: VerChicoComponent, canActivate: [] },
      { path: 'consultas/clinica/nueva', component: NuevaClinicaComponent, canActivate: [] },
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
