import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { SharedService } from "../../../core/_services/shared.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { CustomValidators } from "../../validators/custom-validators";
import { SettingsService } from "../../../core/_services/settings.service";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { SelectItem } from "primeng/api";
import { Router } from "@angular/router";
import { UserService } from "../../../core/_services/user.service";
import moment from "moment";
import { HrService } from "../../../core/_services/hr.service";
import { BranchesService } from "../../../core/_services/branches.service";

@Component({
  selector: "app-submit-attendance",
  standalone: false,
  templateUrl: "./submit-attendance.component.html",
  styleUrl: "./submit-attendance.component.css",
})
export class SubmitAttendanceComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  users: SelectItem[] = [];
  branch_list: SelectItem[] = [];

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  show_input_fileds: boolean = false;

  attendance_record_id: any = null;

  clickEventSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private hrService: HrService,
    private branchService: BranchesService,
  ) {
    this.valForm = this.fb.group({
      user: [null, Validators.required],
      date: ["", Validators.required],
      checkin_time: ["", Validators.required],
      checkout_time: [""],
      branch: [null, Validators.required],
    });

    this.clickEventSubscription = this.sharedService
      .getAddAttendanceRecordClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {
    this.getDropdowns();
  }

  getDropdowns() {
    this.userService.getUserList({ disabled: 0 }).subscribe(
      (data) => {
        if (data.status) {
          this.users = [];

          this.users.push({
            label: "Please Select a user",
            value: null,
            disabled: true,
          });

          for (var item of data.users) {
            if (item.id != 1) {
              this.users.push({
                label: item.firstname + " " + item.lastname,
                value: item.id,
              });
            }
          }
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

    this.branchService.getAllActiveBranches().subscribe((data) => {
      if (data.status) {
        this.branch_list = [];
        this.branch_list.push({
          label: "Please select a branch",
          value: null,
          disabled: true,
        });

        for (var branch of data.branches) {
          this.branch_list.push({
            label: branch.code + " : " + branch.name,
            value: branch.id,
          });
        }
      }
    });
  }

  getDataRow() {
    const user = this.valForm.get("user")?.value;
    var date = this.valForm.get("date")?.value;

    if (!user || !date) {
      return;
    }

    date = moment(date).format("YYYY-MM-DD");
    this.valForm.patchValue({ checkin_time: "", checkout_time: "" });
    this.show_input_fileds = false;

    this.hrService
      .getAttendanceRecordPerUserPerDay({ user: user, date: date })
      .subscribe((data) => {
        if (data.status) {
          this.show_input_fileds = true;
          if (data.attendance) {
            this.attendance_record_id = data.attendance.id;
            var checkin_time = moment(data.attendance.checkin)
              .subtract("+5:30", "hours")
              .format("HH:mm");

            this.valForm.patchValue({
              checkin_time: checkin_time,
            });

            var checkout_time = moment(data.attendance.checkout)
              .subtract("+5:30", "hours")
              .format("HH:mm");

            this.valForm.patchValue({
              checkout_time: checkout_time,
            });

            if (data.attendance.branch) {
              this.valForm.patchValue({ branch: data.attendance.branch });
            }
          } else {
            this.valForm.patchValue({
              checkin_time: "08:00",
            });
            this.valForm.patchValue({
              checkout_time: "18:00",
            });
            this.attendance_record_id = null;
          }
        }
      });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.valForm.reset();
    this.show_input_fileds = false;
    this.attendance_record_id = null;
  }

  submitForm(value: any) {
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid) {
      value.uniquekey = this.uniqueid;

      if (value.checkin_time) {
        value.checkin_time = moment(value.checkin_time, [
          "HH:mm",
          moment.ISO_8601,
        ]).format("HH:mm");
      }

      if (value.checkout_time) {
        value.checkout_time = moment(value.checkout_time, [
          "HH:mm",
          moment.ISO_8601,
        ]).format("HH:mm");
      }

      value.attendance_record_id = this.attendance_record_id;

      this.hrService.sumbitAttendanceForAnother(value).subscribe(
        (data) => {
          if (data.status) {
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Attendance submitted successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });
            this.parentFun.emit();
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
