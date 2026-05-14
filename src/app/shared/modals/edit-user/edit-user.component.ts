import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import { SharedService } from "../../../core/_services/shared.service";
import { ToastrService } from "ngx-toastr";
import { CustomValidators } from "../../validators/custom-validators";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import moment from "moment";
import { UserService } from "../../../core/_services/user.service";

@Component({
  selector: "app-edit-user",
  standalone: false,
  templateUrl: "./edit-user.component.html",
  styleUrl: "./edit-user.component.css",
})
export class EditUserComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  gender_list: SelectItem[] = [
    { label: "Please select a gender", value: null, disabled: true },
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  userlevels: SelectItem[] = [];

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.valForm = this.fb.group({
      id: [null, Validators.required],
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      username: [null, Validators.required],
      designation: [null, Validators.required],
      email: [
        "",
        [Validators.required, Validators.email, CustomValidators.strictEmail],
      ],
      phone: ["", [Validators.required, CustomValidators.phoneFormat]],
      userlevel: [null, Validators.required],
    });

    this.clickEventSubscription = this.sharedService
      .getEditUserClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {
    this.userService.getUserLevels().subscribe((data) => {
      if (data.status) {
        this.userlevels = [];
        this.userlevels.push({
          label: "Please select a user level",
          value: null,
          disabled: true,
        });
        for (var userlevel of data.userlevels) {
          this.userlevels.push({
            label: userlevel.rolename,
            value: userlevel.id,
          });
        }
      }
    });
  }

  openModal() {
    var data = this.sharedService.getUserData();
    this.valForm.patchValue(data);
    this.valForm.patchValue({ phone: data.mobile });
    this.valForm.patchValue({ userlevel: data.userlevel?.id });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.valForm.reset();
  }

  submitForm(value: any) {
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid) {
      value = this.sharedService.sanitizeFormValues(value);
      value.uniquekey = this.uniqueid;

      this.userService.editUser(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "User has been updated successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });
          } else {
            this.toastr.warning(data.err, "ERROR !!", {
              positionClass: "toast-top-right",
              closeButton: true,
            });
            this.generateUniqueKey();
          }
        },
        (error) => {
          alert("API ERROR [ERRCODE:001]");
        },
      );
    }
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }
}
