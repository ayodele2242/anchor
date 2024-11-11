import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EncryptionService } from '../services/encryption.service';
import { StorageService } from '../services/storage.service';
import { DeviceIdService } from '../services/device-id.service';
import { environment } from 'src/environments/environment';
import { DeviceInfoService } from '../services/device-info.service';
import { ToastrService } from '../services/toastr.service';
import { InternetService } from '../services/internet.service';
import { Subscription, interval } from 'rxjs';
import { LoginResponse } from '../interfaces/authResponse.interface';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username!: string;
  password!: string;
  otp: string[] = ['', '', '', '', '', ''];  // Array to hold OTP digits
  loginStatus = '';
  showPassword: boolean = false;
  btnText: string = 'Sign In';
  otpBtnText: string = 'Submit OTP'
  DisplaySpinner: boolean = false;
  DisplayOtpSpinner: boolean = false;
  siteDetails: any = [];
  dataResp: any = [];
  deviceId!: string;
  deviceType!: string;
  browser!: string;
  os!: string;
  retryStatus: any;
  errMsg: any;
  errStatus: boolean = false;
  private retrySubscription!: Subscription;

  public internetStatus$ = this.internetService.onlineStatus$;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private storage: StorageService,
    private encryptionService: EncryptionService,
    private deviceIdService: DeviceIdService,
    private deviceInfoService: DeviceInfoService,
    private toastrService: ToastrService,
    private internetService: InternetService

    ) {
      
      //this.getKeyIv();
      this.apiService.loadLoginStatus();
      if(this.apiService.isLoggedInOk){
        this.router.navigate(['/dashboard']);
      }

    }

    ngOnInit() {

      const ikey = 'ea79db4e19a508c5';
      const iiv = '5d75e1c4e89bf26b';

      const str = {
        "first_name" : "Ayodele",
        "last_name" : "Fagbemi",
        "email" : "fagbemi@gmail.com",
        "street" : "4, Femi Jegede, Ikorodu",
        "state" : "Ekiti",
        "city" : "Ikd",
        "zip" : "10002",
        "company" : "Fagsoft",
        "country" : "NG",
        "phone" : "09048473784",
        "password" : "father2232",
        "cpassword" : "father2232",
        "model" : "",
        "platform" : "",
        "os" : "",
        "osVersion" : "",
        "deviceId" : ""
      };
      const body = JSON.stringify(str);

     const code = this.encryptionService.encrypt(ikey, iiv, body);

     //console.log("Tested data "+code);
    
      
    }

  /*  async getKeyIv(){
   
      const Id = this.deviceIdService.getDeviceId();
      
     const deviceId = Id.replace(/-/g,'').substring(0, 20);
     const str = {"deviceId": deviceId};
     const body = JSON.stringify(str);
     const code = this.encryptionService.encrypt(environment.key, environment.iv, body);

     this.apiService.deviceGenerateKeys(code).subscribe(
      (data: any) => {
        const obj = JSON.stringify(data);
        const enkey =  environment.key;
        const ap = this.encryptionService.base64Decrypt(obj, enkey);
        const parsedData = JSON.parse(ap);
        this.storage.setStorage("key", parsedData.data.key);
        this.storage.setStorage("iv", parsedData.data.iv);
        this.storage.setStorage("sysToken", parsedData.data.token);
        this.errStatus = false;
        if (this.retrySubscription) {
          this.retrySubscription.unsubscribe(); // Stop retrying if data is fetched successfully
        }
      },
      (err) => {
        this.errStatus = true;
        // Handle the initial error
        this.errMsg = 'TOKEN is blank. We are trying to update the application to get the token. ';
    
        // Retry logic
        this.retrySubscription = interval(5000).subscribe(() => {
          this.apiService.deviceGenerateKeys(code).subscribe(
            (data: any) => {
              const obj = JSON.stringify(data);
              const enkey =  environment.key;
              const ap = this.encryptionService.base64Decrypt(obj, enkey);
              const parsedData = JSON.parse(ap);
              this.storage.setStorage("key", parsedData.data.key);
              this.storage.setStorage("iv", parsedData.data.iv);
              this.storage.setStorage("sysToken", parsedData.data.token);
              this.errStatus = false;
              this.retrySubscription.unsubscribe(); // Stop retrying if data is fetched successfully
            },
            (err) => {
              this.errStatus = true;
              this.errMsg = this.getErrorMessage(err);
              
              throw err;
            }
          );
        });
      }
    );

    
    

  }*/

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }


    moveToNext(event: Event, index: number) {
      const input = event.target as HTMLInputElement;
  
      // Auto-move to the next input field if the current one is filled
      if (input.value && index < this.otp.length) {
        const nextInput = input.nextElementSibling as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }

   

    async login() {
      if (!this.username || !this.password) {
        this.toastrService.showError('Username and Password are required', 'Error', 'toast-top-right');
      } else {
        if (this.internetStatus$) {
          this.deviceType = this.deviceInfoService.getDeviceType();
          this.browser = this.deviceInfoService.getBrowser();
          this.os = this.deviceInfoService.getOS();
    
          const userdata = {
            "username": this.username,
            "password": this.password
          };
    
          const text = JSON.stringify(userdata);
          
          this.DisplaySpinner = true;
          this.btnText = 'Signing In';
    
          try {
            const data = await this.apiService.post('auth/login', userdata);
            
            if (data) {
            
              this.dataResp = data;

              

               if(this.dataResp.status === 'error'){
                this.toastrService.showError(this.dataResp.message.password, 'Error', 'toast-top-right');
               }else{
                this.loginStatus = 'success';
                 await this.storage.setStorage("key", this.dataResp.session_data);
                console.log(JSON.stringify(data));
               }
              //const enkey = await this.storage.getStorage("key");
             // const ap = this.encryptionService.base64Decrypt(obj, enkey);
              //await this.storage.setStorage('user', ap);
              //await this.storage.setStorage('login', 'loggedIn');
    
              ///this.router.navigate(['/dashboard']);
              //this.apiService.updateLoginStatus(true);
            }
    
          } catch (error: any) {
            // Handle errors and display appropriate messages
            this.toastrService.showError(error.message, 'Error', 'toast-top-right');
          } finally {
            this.DisplaySpinner = false;
            this.btnText = 'Sign In';
          }
    
        } else {
          this.toastrService.showError('Internet connection is not available. Please try again later.', 'Error', 'toast-top-right');
        }
      }
    }
    
    handlePaste(event: ClipboardEvent) {
      event.preventDefault();
      const pastedData = event.clipboardData?.getData('text') || '';
  
      // Ensure only numbers are pasted and limit to the OTP length
      if (/^\d+$/.test(pastedData)) {
        const otpArray = pastedData.slice(0, this.otp.length).split('');
        otpArray.forEach((digit, i) => {
          this.otp[i] = digit;
        });
  
        // Set focus to the first empty input, if any
        const nextIndex = otpArray.length;
        if (nextIndex < this.otp.length) {
          const nextInput = document.getElementsByName(`otp${nextIndex + 1}`)[0] as HTMLInputElement;
          if (nextInput) nextInput.focus();
        }
      }
    }
  
  
    async verifyOtp() {
      const enteredOtp = this.otp.join('');
      // Logic to verify OTP
      //console.log('Entered OTP:', enteredOtp);
         this.DisplayOtpSpinner = true;
          this.otpBtnText = 'Please wait...';

          const enkey = await this.storage.getStorage("key");
          const userdata ={"otp": enteredOtp, "session_data": enkey}
    
          try {
            const data = await this.apiService.post('auth/verify', userdata);
            
            if (data) {
            
              this.dataResp = data;
              console.log(JSON.stringify(data));

               if(this.dataResp.status === 'error'){
                this.toastrService.showError(this.dataResp.message, 'Error', 'toast-top-right');
               }else{
                await this.storage.setStorage('login', 'loggedIn');
                this.apiService.updateLoginStatus(true);
                await this.storage.setStorage('user', JSON.stringify(data));
                this.router.navigate(['/dashboard']);
                
               }
              
             
            }
    
          } catch (error: any) {
            // Handle errors and display appropriate messages
            this.toastrService.showError(error.message, 'Error', 'toast-top-right');
          } finally {
            this.DisplaySpinner = false;
            this.btnText = 'Sign In';
          }
          
    }

    forgotPwd(){
      this.router.navigate(['/forgot-password']);
    }

    getErrorMessage(err: any): any {
      // Handle other errors based on err.status
     if(err.message.includes('response for')){
      return 'Error connecting to server.'
     }else if(err.message.includes('during parsing')){
      return 'No connection could be made because the target machine actively refused it. Make sure your database in active and running'
     }else if(err.status == 404){
      return 'The end-point you are trying to access is not found';
     }
     else{
      return 'An unknown error occured. Please try again later';
     }
    }

}
