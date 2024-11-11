import { Component, HostListener, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { languages, notifications, userItems } from './header-dummy-data';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ApiService } from '../services/api.service';
import { SharedCommandService } from '../services/sharedcommand.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() collapsed = false;
  @Input() screenWidth = 0;
  @Output() commandSent = new EventEmitter<void>();

  isOverlayVisible = false;
  canShowSearchAsOverlay = false;
  selectedLanguage: any;
  languages = languages;
  notifcations = notifications;
  userItems = userItems;

  constructor(private router: Router, 
    private storage: StorageService, 
    private apiService: ApiService, 
    private sharedCommandService: SharedCommandService
   ){

  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }
  

  ngOnInit(): void {
      this.checkCanShowSearchAsOverlay(window.innerWidth);
      this.selectedLanguage = this.languages[0];

      const storedValue = localStorage.getItem('isOverlayVisible');
      this.isOverlayVisible = storedValue === 'true';
    }

  getHeadClass(): string {
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768){
      styleClass = 'head-trimmed';
    }else{
      styleClass = 'head-mid-screen';
    }

    return styleClass;
  }
  
  checkCanShowSearchAsOverlay(innerWidth: number): void {
    if(innerWidth < 845){
      this.canShowSearchAsOverlay = true;
    }else{
      this.canShowSearchAsOverlay = false;
    }
  }



 async logOut(){
    await this.storage.clear();
    this.apiService.clearLoginStatus();
    this.router.navigate(['/login']);
  }

  logScreen(){ 
    this.isOverlayVisible = !this.isOverlayVisible;
    localStorage.setItem('isOverlayVisible', this.isOverlayVisible.toString());
    const lockElement = document.querySelector('iDisplay');
    if (lockElement) {
      // Remove the class
      lockElement.classList.remove('hidden');
    }
  }

  closeOverlay() {
    this.isOverlayVisible = this.isOverlayVisible;
    localStorage.setItem('isOverlayVisible', 'false');
  }

  openMenu() {
    this.sharedCommandService.sendCommand('openMenu');
  }


}
