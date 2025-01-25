import { Component, OnInit, ChangeDetectorRef, HostListener, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './services/api.service';
import { Observable } from 'rxjs';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit{
  title = 'finance';

  isSideNavCollapsed = false;
  screenWidth = 0;
  isLoggedInFlag: boolean = false;
  isLoggedIn = false;
  loadHeader = false;
  loadSideNav = false;
  token!: string | null;
  initialized = false;

  // Save the last visited URL in localStorage on each route change
  @HostListener('window:unload', ['$event'])
  saveLastVisitedUrl() {
    localStorage.setItem('lastVisitedUrl', this.router.url);
  }

  constructor(private router: Router, public authService: ApiService, private cdr: ChangeDetectorRef) {
    this.authService.loadLoginStatus();
  }

  ngOnInit() {
   
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  reloadComponent() {
    
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  
}
