import { Injectable } from '@angular/core';
import { CognitoUser, CognitoUserPool, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Amplify } from 'aws-amplify';

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  
  constructor() {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: environment.cognito.UserPoolId,
          userPoolClientId: environment.cognito.ClientId,
          identityPoolId: "<your-cognito-identity-pool-id>",
          loginWith: {
            email: true,
          },
          signUpVerificationMethod: "code",
          userAttributes: {
            email: {
              required: true,
            },
          },
          allowGuestAccess: true,
          passwordFormat: {
            minLength: 8,
            requireLowercase: true,
            requireUppercase: true,
            requireNumbers: true,
            requireSpecialCharacters: true,
          }
        },
      },
    })
  }
}
