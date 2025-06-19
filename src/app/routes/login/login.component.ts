import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "../../core/_services/authentication.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-login",
  standalone: false,
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authenticationServive: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    const formData = this.loginForm.value;

    this.authenticationServive
      .login(formData.username, formData.password, null)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.status) {
            if (data.body.two_factor_enabled == 0) {
              // store username and jwt token in local storage to keep user logged in between page refreshes
              var user_id = data.body.username;

              localStorage.setItem(
                "currentUser",
                JSON.stringify({ user_id, token: data.body.token })
              );
              this.router.navigate(["/"]);
            }
            //this.saved_data = value;}}
          } else {
            this.toastr.error("Username or Password Invalid", "ERROR !!", {
              positionClass: "toast-top-right",
              closeButton: true,
            });
          }
        },
        (error) => {
          //this.loading = false;
          this.toastr.error("Username or Password Invalid", "ERROR !!", {
            positionClass: "toast-top-right",
            closeButton: true,
          });
        }
      );
  }
}
