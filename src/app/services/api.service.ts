import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError, map, switchMap, retryWhen } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of, Subject, throwError, timer } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { environment } from 'src/environments/environment';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private endPointUrl = environment.url;
  public testEmail = "y";
  session:any;
  usession:any;
  sitesession:any;
  loginState="Login";
  private isLoggedInFlag = false;
  isLoggedInOk = false;
  private readonly isLoggedInKey = 'isLoggedIn';

  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) {
    this.loadLoginStatus();
   }


  private httpEventListener: Subject<Object> = new Subject<Object>();
  observeHttp: Observable<Object> = this.httpEventListener.asObservable();

  public uploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public downloadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);


  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  loadLoginStatus() {
    const storedStatus = localStorage.getItem(this.isLoggedInKey);
    this.isLoggedInOk = storedStatus ? JSON.parse(storedStatus) : false;
  }

  updateLoginStatus(status: boolean) {
    this.isLoggedInOk = status;
    localStorage.setItem(this.isLoggedInKey, JSON.stringify(status));
  }

  clearLoginStatus() {
    this.updateLoginStatus(false);
  }

  logout() {
    // Perform logout logic here, such as clearing session data or making an API call
    // Once the logout is successful, set isLoggedIn to false
    this.isLoggedInFlag = false;
  }

async getToken(){
  return await this.storage.getStorage("sysToken");
}

getHeaders() {

 let headers = {
     headers: new HttpHeaders({
         "Content-Type": "application/json",
     })
   };

   return headers;
 }

 getClientHeaders() {

  return this.storage.getStorage("sysToken").then((token: any) => {
    let header = {
      headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": token
      })
    };
    return header;
  });
}


  getTransactionPin() {
    return this.storage.getStorage("transactionPin").then((value: any) => value);
  }

  getEndPoint() {
    return this.endPointUrl;
  }

  deviceGenerateKeys(data: any){
    return this.http.post(this.getEndPoint()+"/generate_iv_key", data,  this.getHeaders())
    .pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  getAssignedmentors(data: any){
    return this.http.post(this.getEndPoint()+"/mentors/getAssignedMentors", data,  this.getHeaders())
    .pipe(
      tap(Data => console.log()),
      catchError(this.handleError<any[]>('Get data', []))
    );
  }

  systemLogin(data: any){

    return this.http.post(this.getEndPoint()+"/auth/system_login", data,  this.getHeaders())
    .pipe(
      tap(Data =>
        console.log()
        ),
      catchError(this.handleError<any[]>('Get data', []))
    );

  }

  register(data: any) {
    return this.http.post(this.getEndPoint()+'/register', data, this.httpOptions);
  }


  login(data: any){
    return this.http.post(this.getEndPoint()+'/auth/login', data, this.httpOptions);
  }

  updateProfile(data: any){
    return this.http.post(this.getEndPoint()+'/profile-update', data, this.httpOptions);
  }

  recoverPwd(data: any) {
    return this.http.post(this.getEndPoint()+'/pwd_recovery', data, this.httpOptions);
  }

  pwdUpdate(data: any) {
    return this.http.post(this.getEndPoint()+'/pwd_update', data, this.httpOptions);
  }

  getChats(roomId: number, senderId: number, receiverId: number){
    return this.http.get(this.getEndPoint()+`/chats/records?roomId=${roomId}&senderId=${senderId}&receiverId=${receiverId}`, this.httpOptions);
  }

  uploadFile(data: any): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST',  `${this.getEndPoint()}/chats/mediaUpload`, data, {
      reportProgress: true
    });
    return this.http.request(req);
  }

  uploadProfileImg(data: any): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST',  `${this.getEndPoint()}/auth/profileImgUpdate`, data, {
      reportProgress: true
    });
    return this.http.request(req);
  }



   // GET request
   async get<T>(endpoint: string, params?: any): Promise<T | undefined> {
    try {
      const response = await axios.get<T>(`${environment.url}/${endpoint}`, { params });
      return response.data;
    } catch (error) {
      this.handleErrors(error);
      return undefined;
    }
  }

  // POST request
  async post<T>(endpoint: string, data: any, headers?: any): Promise<T | undefined> {
    try {
      const config: AxiosRequestConfig = {
        headers,
      };
      const response = await axios.post<T>(`${environment.url}/${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      const errorMessage = this.handleErrors(error);
      throw new Error(errorMessage); // Throwing error with user-friendly message
    }
  }
  

  // PUT request
  async put<T>(endpoint: string, data: any, headers?: any): Promise<T | undefined> {
    try {
      const config: AxiosRequestConfig = {
        headers,
      };
      const response = await axios.put<T>(`${environment.url}/${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      this.handleErrors(error);
      return undefined;
    }
  }

  // DELETE request
  async delete<T>(endpoint: string, params?: any): Promise<T | undefined> {
    try {
      const config: AxiosRequestConfig = {
        params,
      };
      const response = await axios.delete<T>(`${environment.url}/${endpoint}`, config);
      return response.data;
    } catch (error) {
      this.handleErrors(error);
      return undefined;
    }
  }

  


  postData(endpoint: string, data: any): Observable<any> {
    const url = `${environment.url}${endpoint}`;

    return this.http.post(url, data);
  }

  getStuff(uri: string): Observable<any> {
    let url = this.getEndPoint() + uri;
    return this.http.get(url, this.httpOptions)
      .pipe(
        catchError((err) => {
          throw err; // Throw the error to trigger the retry logic
        })
      );
  }


  
  fetchDataWithRetry(uri: string): Observable<any> {
    const url = this.getEndPoint() + uri;
    return this.http.get(url, this.httpOptions).pipe(
      retryWhen(errors =>
        errors.pipe(
          switchMap((error, retryCount) => {
            if (retryCount < 5) {
              // Retry every 2 seconds (2000 milliseconds)
              return timer(2000);
            }
            return throwError(error);
          })
        )
      ),
      catchError(error => {
        // Handle error or re-throw it to propagate to the subscriber
        return throwError(error);
      })
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //console.error(error);
      console.log(`${operation} failed: `+JSON.stringify(error));
      return of(result as T);
    };
  }

  private handleErrors(error: any): string {
    console.error('API request error:', error);
  
    // Customize error messages based on the error status
    if (error.response) {
      if (error.response.status === 400) {
        return error.response.data.msg || "Invalid username or password.";
      } else if (error.response.status === 500) {
        return "A server error occurred. Please try again later.";
      }
      // Add more error status cases as needed
    } else if (error.request) {
      return "No response from the server. Please check your network connection.";
    } 
  
    // Fallback error message
    return "An unexpected error occurred. Please try again.";
  }
  
  

}