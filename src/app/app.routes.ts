import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { AdminGuard } from './guards/admin.guard';
import { UserViewComponent } from './components/user-view/user.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: NavbarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'user', component: UserViewComponent, data: { icon: 'person' }},
      { path: 'admin', component: AdminViewComponent, canActivate: [AdminGuard], data: { icon: 'admin_panel_settings' }},
      { path: '', redirectTo: '/login', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];