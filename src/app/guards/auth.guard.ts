import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: ApiService, 
    private router: Router, 
    private location: Location) { }

  canActivate(): boolean {
    const token = localStorage.getItem('login') || null;
    if (token) {
      return true;  // User is logged in, allow access to protected routes
    } else {
      this.router.navigate(['/login']);
      return false;  // User is not logged in, restrict access to protected routes
    }
  }

  checkBackButton(): void {
    this.location.subscribe(() => {
      if (localStorage.getItem('isLoggedIn') !== 'true') {
        // Redirect to the login page
        this.router.navigate(['/login']);
      }
    });
  }
  
}
