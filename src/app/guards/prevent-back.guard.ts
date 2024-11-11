import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PreventBackGuard implements CanActivate {
  constructor(private authService: ApiService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.updateLoginStatus(true)) {
      this.router.navigate(['/dashboard']); // Redirect to the dashboard if logged in
      return false; // Block access to the login page
    }
    return true; // Allow access to the login page
  }

 
}
