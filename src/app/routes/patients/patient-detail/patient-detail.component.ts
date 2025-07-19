import { Component, numberAttribute, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { PatientsService } from "../../../core/_services/patients.service";
import moment from "moment";

@Component({
  selector: "app-patient-detail",
  standalone: false,
  templateUrl: "./patient-detail.component.html",
  styleUrl: "./patient-detail.component.css",
})
export class PatientDetailComponent {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  private sub: any;
  id!: number;
  patient: any;
  age: number = 0;

  note: any;

  constructor(
    private authservice: AuthenticationService,
    private patientService: PatientsService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.generateUniqueKey();
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
    });

    this.sub = this.route.params.subscribe((params) => {
      this.id = +params["id"];
      this.getData(this.id);
    });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  getData(id: number) {
    this.patientService.getPatient({ id: id }).subscribe((data) => {
      if (data.status) {
        this.patient = data.patient;
        this.LoadUI = true;
        if (this.patient.dob) {
          console.log("jj");

          const birthDate = moment(this.patient.dob);
          this.age = moment().diff(birthDate, "years");
        }
      }
    });
  }

  updateStatus(value: number) {
    statusString = "";
    if (value == 2) {
      var statusString = "Approved";
    }
    if (value == 0) {
      var statusString = "Pending";
    }
    if (value == -2) {
      var statusString = "Rejected";
    }
    swal
      .fire({
        title:
          "Please confirm that you want to mark this patient as " +
          statusString,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745", // ✅ Green button
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
        customClass: {
          title: "swal-title-sm",
          confirmButton: "swal-confirm-sm",
          cancelButton: "swal-cancel-sm",
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          var obj = {
            status: value,
            id: this.id,
            uniquekey: this.uniqueid,
          };
          this.patientService.updatePatientStatus(obj).subscribe(
            (data) => {
              if (data.status) {
                this.toastr.success(
                  "Patient status has been updated successfully.",
                  "Success",
                  {
                    positionClass: "toast-top-right",
                    closeButton: true,
                    timeOut: 3000,
                    progressBar: true,
                    toastClass: "toast toast-sm", // <-- add your small class here
                  }
                );

                this.generateUniqueKey();
                this.getData(this.id);
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
      });
  }
}
