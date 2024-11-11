// authentication.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isLoggedIn = false;

  constructor() {}

  login() {
    // Perform the login logic here
    this.isLoggedIn = true;
  }

  logout() {
    // Perform the logout logic here
    this.isLoggedIn = false;
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }
}
