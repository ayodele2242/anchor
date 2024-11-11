import { Component, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { EncryptionService } from '../services/encryption.service';
import { StorageService } from '../services/storage.service';
import { ToastrService } from '../services/toastr.service';
import { DeviceIdService } from '../services/device-id.service';
import { DeviceInfoService } from '../services/device-info.service';
import { HeaderComponent } from '../header/header.component';
import { SharedCommandService } from '../services/sharedcommand.service';



@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.scss']
})
export class LockComponent {
[x: string]: any;

  password!: string;
  showPassword: boolean = false;
  btnText: string = 'Sign In';
  DisplaySpinner: boolean = false;
  siteDetails: any = [];
  email: any;
  info: any;
  dataResp: any = [];
  deviceId!: string;
  deviceType!: string;
  browser!: string;
  os!: string;
  isOverlayVisible: boolean = false;
  headerComponent: HeaderComponent;

  @Input() showOverlay: boolean | undefined;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private storage: StorageService,
    private encryptionService: EncryptionService,
    private toastrService: ToastrService,
    private deviceIdService: DeviceIdService,
    private deviceInfoService: DeviceInfoService,
    private renderer: Renderer2,
    private sharedCommandService: SharedCommandService
    ) {
      this.headerComponent = new HeaderComponent(this.router, this.storage, this.apiService, this.sharedCommandService);
    }

 async ngOnInit() {
  const info = await this.storage.getStorage('user');
  const userInfo = JSON.parse(info);
  this.info = userInfo?.data;

  const storedValue = localStorage.getItem('isOverlayVisible');
  this.isOverlayVisible = storedValue === null || storedValue === 'true';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

 async anotherAccount(){
    await this.storage.clear();
    this.apiService.clearLoginStatus();
    this.isOverlayVisible = false;
    localStorage.setItem('isOverlayVisible', 'false');
    this.router.navigate(['/login']);
  }

 async loginBack(){

    if(!this.password){
      this.toastrService.showError('Enter Password to continue', 'Error', 'toast-top-right');
     }else{

     

      const iv = await this.storage.getStorage("iv");
      const key = await this.storage.getStorage("key");
      this.deviceType = this.deviceInfoService.getDeviceType();
      this.browser = this.deviceInfoService.getBrowser();
      this.os = this.deviceInfoService.getOS();

         
      const userdata = {"username": this.info?.email, "password": this.password, 
      "deviceType": this.deviceType, "browser": this.browser, "os": this.os};

       let text = JSON.stringify(userdata);
       const code = this.encryptionService.encrypt(key, iv, text);
       this.DisplaySpinner = true;
       this.btnText = 'Signing In';

       this.apiService.login(code).subscribe(
        async data => {
         
         //this.headerComponent.closeOverlay();
         /*const divElement = document.getElementById('overlay');
         this.renderer.addClass(divElement, 'hidden');*/

         this.isOverlayVisible = false;
         localStorage.setItem('isOverlayVisible', 'false');
        
          this.DisplaySpinner = false;
          this.btnText = 'Sign In';
          


        },
        async (err) => {
            this.DisplaySpinner = false;
            this.btnText = 'Sign In';
            console.log("Error "+ JSON.stringify(err));



        if(err.status === 400){
          this.toastrService.showError(err.error.msg, 'Error', 'toast-top-right');

        }else{
          this.toastrService.showError(this.getErrorMessage(err), 'Error', 'toast-top-right');
           

        }

        }
      );

     


     }//Else end


  }


  getErrorMessage(err: any): string {
    // Handle other errors based on err.status
    switch (err.status) {
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      default:
        return 'Oooops! An error occured. It\'s from our end. Please try again later. ';
    }
  }

}
