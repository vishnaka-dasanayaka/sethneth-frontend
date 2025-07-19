import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import { SharedService } from "../../../core/_services/shared.service";
import { ToastrService } from "ngx-toastr";
import { CustomValidators } from "../../validators/custom-validators";
import swal from "sweetalert2";
import { PatientsService } from "../../../core/_services/patients.service";

@Component({
  selector: "app-add-patient",
  standalone: false,
  templateUrl: "./add-patient.component.html",
  styleUrl: "./add-patient.component.css",
})
export class AddPatientComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  gender_list: SelectItem[] = [
    { label: "Please select a gender", value: null, disabled: true },
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private patientService: PatientsService,
    private toastr: ToastrService
  ) {
    this.valForm = this.fb.group({
      name: [null, Validators.required],
      phone: ["", [CustomValidators.phoneFormat]],
      gender: [null],
      dob: [null],
      nic: [null, [CustomValidators.nicValidator]],
      address: [null],
      description: [null],
    });

    this.clickEventSubscription = this.sharedService
      .getAddPatientClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {}

  openModal() {
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
      value.uniquekey = this.uniqueid;

      this.patientService.createPatient(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Patient has been created successfully.",
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
        }
      );
    }
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }
}
