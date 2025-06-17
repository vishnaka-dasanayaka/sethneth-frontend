import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { signOut } from 'aws-amplify/auth';

@Injectable()
export class AuthHeader implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = localStorage.getItem(`CognitoIdentityServiceProvider.${environment.cognito.ClientId}.LastAuthUser`);
    const authToken = localStorage.getItem(`CognitoIdentityServiceProvider.${environment.cognito.ClientId}.${user}.accessToken`)

    let modifiedReq = req;

    if (authToken) {
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
        return throwError(() => error);
      })
    );
  }

  private async logout(): Promise<void> {
    try {
          await signOut();
          localStorage.clear();
          this.router.navigate(['/login']);
          
        } catch (error) {
          console.error('Error during sign out:', error);
        }
  }
}
