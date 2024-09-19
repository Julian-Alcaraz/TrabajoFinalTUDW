import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MiUsuarioComponent } from './pages/usuarios/mi-usuario/mi-usuario.component';
import { NuevoUsuarioComponent } from './pages/usuarios/nuevo-usuario/nuevo-usuario.component';
import { ListaUsuarioComponent } from './pages/usuarios/lista-usuario/lista-usuario.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      // { esto yo creo que sirve par ahacer lazy loading y en component pones el modulo
      //   path: 'usuarios',
      //   children: [
      //     { path: '', redirectTo: '/usuarios/miUsuario', pathMatch: 'full' },
      //     { path: 'usuarios/miUsuario', component: MiUsuarioComponent },
      //     { path: 'usuarios/nuevo', component: NuevoUsuarioComponent },
      //     { path: 'usuarios/list', component: ListaUsuarioComponent },
      //   ],
      // },
      { path: 'usuarios/miUsuario', component: MiUsuarioComponent },
      { path: 'usuarios/nuevo', component: NuevoUsuarioComponent },
      { path: 'usuarios/list', component: ListaUsuarioComponent },
    ],
  },
];
