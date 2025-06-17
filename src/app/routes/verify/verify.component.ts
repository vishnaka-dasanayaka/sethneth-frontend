import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CognitoService } from '../../core/_services/cognito.service';
import { Router } from '@angular/router';
import { autoSignIn, confirmSignUp, fetchAuthSession, fetchUserAttributes, getCurrentUser, resendSignUpCode } from 'aws-amplify/auth';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/_services/user.service';
import { environment } from '../../../environments/environment';
import { Amplify } from 'aws-amplify';

@Component({
  selector: 'app-verify',
  standalone: false,
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  verifyForm: FormGroup;
  codeDigits: string[] = ['', '', '', '', '', ''];
  email: string | null = null;
  loading = false;
  resendDisabled: boolean = false;
  timerInterval: any;
  countdown: number = 0;

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService
  ) {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.email = localStorage.getItem('email');
  }

  onDigitInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    // Accept only digits
    if (/^\d$/.test(value)) {
      this.codeDigits[index] = value;

      input.focus();
      input.value = '';
  
      // Move to the next input
      // const nextInput = input.nextElementSibling as HTMLInputElement;
      // if (nextInput) {
      //   nextInput.focus();
      //   nextInput.select();
      // }
    } else {
      // Remove any non-digit input
      this.codeDigits[index] = '';
      input.value = '';
    }

    // Update the FormControl
    this.verifyForm.get('code')?.setValue(this.codeDigits.join(''));
    
  }

  async onSubmit() {
    const code = this.codeDigits.join('');
    this.verifyForm.get('code')?.setValue(code);

    if (this.verifyForm.valid) {
      const { code } = this.verifyForm.value;

      if (!this.email) {
        alert('Email not found in local storage.');
        return;
      }

      this.loading = true;

      try {
        const { nextStep: confirmSignUpNextStep } = await confirmSignUp({
          username: this.email,
          confirmationCode: code,
        });
        
        if (confirmSignUpNextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
          const { nextStep } = await autoSignIn();
          
          if (nextStep.signInStep === 'DONE') {
            try {
              await this.userService.addUser().subscribe();
              this.toastr.success('Successfully signed in', 'Tada');

              await this.addRole();
              
              this.router.navigate(['/home']);
            } catch (userAddError) {
              console.error('Error adding user:', userAddError);
              this.toastr.warning('Signed in, but failed to register user', 'Tada');
            }
          }
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        this.toastr.error(error.message || 'Verification failed', 'Tada');
      } finally {
        this.loading = false;
      }

    } else {
      this.toastr.error('Please enter email and confirmation code', 'Tada');
    }
  }

  async resend(){
    if (this.email) {
      await resendSignUpCode({username: this.email});

      this.codeDigits = ['', '', '', '', '', ''];

      const inputs = document.querySelectorAll<HTMLInputElement>('input.digit-input');
      inputs.forEach(input => input.value = '');

      this.verifyForm.get('code')?.setValue('');

    } else {
      console.error("Username is null");
    }
    this.startCountdown(120);

  }

  startCountdown(seconds: number) {
    this.countdown = seconds;
    this.resendDisabled = true;

    this.timerInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(this.timerInterval);
        this.resendDisabled = false;
      }
    }, 1000);
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
}
