import { Component, Renderer2 } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  selectedTab: string = 'personal_details';
  isMobile: boolean = false;

  constructor(private renderer: Renderer2, private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {

    this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
    
    // Load the selected tab from Local Storage (if available)
    const storedTab = localStorage.getItem('selectedTab');
    if (storedTab) {
      this.selectedTab = storedTab;
      //this.adjustActiveContent();
    }
  }

  selectTab(tabName: string) {
    this.selectedTab = tabName;
    //this.adjustActiveContent();
    // Save the selected tab to Local Storage
    localStorage.setItem('selectedTab', tabName);
  }





}
