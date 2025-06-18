import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-login",
  standalone: false,
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  LogInForm: FormGroup;
  loading = false;

  constructor( private fb: FormBuilder, private router: Router, private toastr: ToastrService) {
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
   
    
  }


}
