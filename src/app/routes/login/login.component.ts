import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CognitoService } from "../../core/_services/cognito.service";
import { fetchUserAttributes, signIn, signInWithRedirect } from "aws-amplify/auth";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { Amplify } from "aws-amplify";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-login",
  standalone: false,
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  LogInForm: FormGroup;
  loading = false;

  constructor(private cognitoService: CognitoService, private fb: FormBuilder, private router: Router, private toastr: ToastrService) {
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
        this.router.navigate(['/home']);
      }catch (error) {
        this.toastr.error('Sign-in failed', 'Error');
        this.loading = false;
      }    

    } else {
      const controls = this.LogInForm.controls;
      if (controls['email'].hasError('required') || controls['password'].hasError('required')) {
        this.toastr.error('Please fill in all required fields', 'Error');
        return;
      }

      if (controls['email'].hasError('email')) {
        this.toastr.error('Email format is invalid', 'Error');
        return;
      }
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
}
