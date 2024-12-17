import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { navbarData } from './nav-data';
import { DeviceIdService } from '../services/device-id.service';
import { SharedCommandService } from '../services/sharedcommand.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms', 
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;
  commandFromA: string | undefined;
  isMobile = false;
  isTablet = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    const newWidth = window.innerWidth;
  
    if (newWidth <= 768 && this.screenWidth > 768) {
      this.collapsed = true; // Collapse when moving to mobile
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: newWidth });
    } else if (newWidth > 768 && this.screenWidth <= 768) {
      this.collapsed = false; // Expand when moving to desktop
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: newWidth });
    }
  
    this.screenWidth = newWidth;
  }
  
  constructor(
    public router: Router,
    private sharedCommandService: SharedCommandService, 
    private renderer: Renderer2, 
    private elementRef: ElementRef,
    private breakpointObserver: BreakpointObserver) {}

  
    ngOnInit(): void {
      this.screenWidth = window.innerWidth;
      this.collapsed = this.screenWidth <= 768; // Collapse only for small screens
      
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    
      // Ensure the sidenav is visible by default
      const myDiv = this.elementRef.nativeElement.querySelector('.sidenav');
      if (myDiv) {
        this.renderer.setStyle(myDiv, 'display', 'block');
      }
    
      // Set up breakpoints
      this.setupBreakpoints();
    }

    
    setupBreakpoints(): void {
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
        .pipe(map((result) => result.matches))
        .subscribe((isMobile) => {
          this.isMobile = isMobile;
          if (isMobile) {
            this.collapsed = true; // Collapse for mobile
            console.log("Mobile mode activated");
          }
        });
    
      this.breakpointObserver
        .observe([Breakpoints.TabletPortrait, Breakpoints.TabletLandscape, Breakpoints.Web])
        .pipe(map((result) => result.matches))
        .subscribe((isTabletOrDesktop) => {
          this.isTablet = isTabletOrDesktop && this.screenWidth > 768;
          if (this.isTablet) {
            this.collapsed = false; // Expand for desktop/tablet
            console.log("Desktop mode activated");
          }
        });
    }
    

       
  
  closeMobileSidenav(){
    const myDiv = this.elementRef.nativeElement.querySelector('.sidenav');
    if (myDiv) {
      this.renderer.setStyle(myDiv, 'display', 'none');
    }

  }


  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  receiveCommand() {
    console.log("Received signal");
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for(let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }


}
