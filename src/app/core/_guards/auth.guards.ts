import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { environment } from "../../../environments/environment";
import { Amplify } from "aws-amplify";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem(
        `CognitoIdentityServiceProvider.${environment.cognito.ClientId}.LastAuthUser`
      );
      if (user) {
        try {
          Amplify.configure({
            Auth: {
              Cognito: {
                userPoolId: environment.cognito.UserPoolId,
                userPoolClientId: environment.cognito.ClientId,
              },
            },
          });

          const userAttributes = await fetchUserAttributes();
          const role = userAttributes["custom:role"];
          if (role) {
            localStorage.setItem("role", role);
          } else {
            console.warn("User role is undefined");
          }
          return true;
        } catch (err) {
          console.error("Failed to fetch user attributes", err);
          this.router.navigate(["/login"], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }
      } else {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
    }

    this.router.navigate(["/register"], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
