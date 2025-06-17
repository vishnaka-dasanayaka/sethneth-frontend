import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Amplify } from 'aws-amplify';
import { fetchUserAttributes, signIn, signInWithRedirect } from 'aws-amplify/auth';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { CognitoService } from '../../core/_services/cognito.service';

@Component({
  selector: 'app-login-popup',
  standalone: false,
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.css'
})
export class LoginPopupComponent {
  LogInForm: FormGroup;
  loading = false;

  @Output() loginStatus = new EventEmitter<boolean>();

  constructor( private cognitoService: CognitoService, private fb: FormBuilder, private router: Router, private toastr: ToastrService) {
    this.LogInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.LogInForm.valid) {
      
      
      this.loading = true;
      const { email, password } = this.LogInForm.value;
      try{

        await signIn({
          username: email,
          password: password,
        });
        
        await this.addRole();
        
        this.toastr.success('Sign-in successful', 'Done');
        // this.loginStatus.emit(true);
        window.location.reload();
      } catch (error) {
        console.log(error);
        
        this.toastr.error('Sign-in failed', 'Error');
        this.loginStatus.emit(false);
        this.loading = false;
      }    

    } else {
      this.toastr.error('Please fill in all required fields', 'Done');
    }
  }

  async addRole(){
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: environment.cognito.UserPoolId,
          userPoolClientId: environment.cognito.ClientId,
        }
      }
    });
    const userAttributes = await fetchUserAttributes();
    const role = userAttributes["custom:role"];
    if (role) {
      localStorage.setItem("role", role);
    } else {
      console.warn("User role is undefined");
    }
  }

  async signInWithGoogle() {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (err) {
      console.error('Google sign-in error', err);
      this.toastr.error('Google Sign-in failed', 'Error');
    }
  }

  onClose() {
    this.loginStatus.emit(true);
  }
}
