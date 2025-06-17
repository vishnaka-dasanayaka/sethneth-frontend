import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginRedirectGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem(
        `CognitoIdentityServiceProvider.${environment.cognito.ClientId}.LastAuthUser`
      );

      if (user) {
        // User is signed in → redirect to /home
        this.router.navigate(['/home']);
        return false;
      }

      // No user → allow access to /login
      return true;
    }

    // On the server → allow navigation
    return true;
  }
}
