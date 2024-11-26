import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard, loginGuard } from './guards/auth.guard';

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
        path: 'miUsuario',
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
      {
        path: 'administracion',
        loadChildren: () => import('./lazy-modules/administracion.module').then((m) => m.AdministracionModule),
      },
    ],
  },
];

