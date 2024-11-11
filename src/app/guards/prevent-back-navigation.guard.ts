import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PreventBackNavigationGuard implements CanDeactivate<any> {
  constructor(private location: Location) {}

  canDeactivate(): boolean {
    const navigationId = (this.location.getState() as { navigationId: number }).navigationId;
    if (navigationId === 1) {
      this.location.go('/');
      return false;
    }
    return true;
  }
}
