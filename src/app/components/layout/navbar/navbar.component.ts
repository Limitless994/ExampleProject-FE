import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { filter } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule]
})
export class NavbarComponent {
  title: string = '';
  icons = {
    user: 'person',
    admin: 'admin_panel_settings'
  };

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentRoute = this.router.routerState.root.firstChild;
      if (currentRoute && currentRoute.snapshot.data) {
        this.title = currentRoute.snapshot.data['title'] || 'Default Title';
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  isAdmin(){
    return this.authService.isAdmin()
  }
}