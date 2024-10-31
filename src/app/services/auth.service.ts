import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/public/login';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userRole = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.loggedIn.next(true);
      this.setUserRole(token);
    }
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<any>(this.apiUrl, credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.access_token);
        this.setUserRole(response.access_token);
        this.loggedIn.next(true);
        
        if (this.userRole.getValue()?.includes('ADMIN')) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: () => {
        alert('Login failed');
      },
    });
  }

  private setUserRole(token: string) {
    const decodedToken: any = jwtDecode(token);
    
    const roles = decodedToken['resource_access']?.['example-application-client']?.roles || [];
    
    this.userRole.next(roles.join(', '));
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.userRole.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getRole() {
    return this.userRole.asObservable();
  }

  isAdmin(): boolean {
    return this.userRole.getValue()?.includes('ADMIN') ?? false;
  }

  isUser(): boolean {
    return this.userRole.getValue()?.includes('USER') ?? false;
  }
}
