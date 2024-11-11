import { Component, HostListener, OnInit } from '@angular/core';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  innerWidth: any;
  
  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  constructor() { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth
  }


@HostListener('window:resize', ['$event'])
onResize(event: any){
  this.innerWidth = window.innerWidth
}

getClass(){
  return this.innerWidth < 925 ? 'row-md' : 'row';
}

}
