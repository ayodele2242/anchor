import { Injectable } from '@angular/core';
import { 
  HttpEvent, 
  HttpHandler, 
  HttpInterceptor, 
  HttpRequest, 
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get token from localStorage
    const token = localStorage.getItem('sysToken');

    // Skip modifying headers for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return next.handle(req);
    }

    // Clone the request to add Content-Type and Accept headers
    let modifiedReq = req.clone({
      headers: req.headers
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    });

    // Add authorization header if token exists
    if (token) {
      modifiedReq = modifiedReq.clone({
        headers: modifiedReq.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    // Handle the modified request and errors
    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized access by clearing token
          localStorage.removeItem('sysToken');
          // Optionally redirect to login
          // this.router.navigate(['/login']);
        }
        
        return throwError(() => error);
      })
    );
  }
}
