import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ReportsService } from "../../../core/_services/reports.service";
import { BranchesService } from "../../../core/_services/branches.service";
import { SelectItem } from "primeng/api";
import { SettingsService } from "../../../core/_services/settings.service";
import swal from "sweetalert2";
import moment from "moment";

@Component({
  selector: "app-patient-report",
  standalone: false,
  templateUrl: "./patient-report.component.html",
  styleUrl: "./patient-report.component.css",
})
export class PatientReportComponent {
  sysuser: any;
  LoadUI: boolean = false;

  from_date: any = null;
  to_date: any = null;
  gender: any[] = [];
  status: any[] = [];

  patient_data: any[] = [];

  gender_list: SelectItem[] = [
    { label: "Please select gender", value: null, disabled: true },
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];
  status_list: SelectItem[] = [
    { label: "Please select a status", value: null, disabled: true },
    { label: "Approved", value: 2 },
    { label: "Rejected", value: -2 },
    { label: "Pending", value: 0 },
  ];
  rangeDates: Date[] | undefined;

  constructor(
    private authservice: AuthenticationService,
    private reportsService: ReportsService,
  ) {}

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  generateReport() {
    if (
      this.gender == null ||
      this.gender.length == 0 ||
      this.status == null ||
      this.status.length == 0
    ) {
      swal.fire({
        title: "Warning!",
        text: "Gender and Status are mandetory",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }

    if (
      this.rangeDates &&
      (this.rangeDates[0] == null || this.rangeDates[1] == null)
    ) {
      swal.fire({
        title: "Warning!",
        text: "Invalid Date Range",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }

    this.from_date = this.rangeDates
      ? moment(this.rangeDates[0]).startOf("day").format("YYYY-MM-DD HH:MM:ss")
      : null;
    this.to_date = this.rangeDates
      ? moment(this.rangeDates[1]).endOf("day").format("YYYY-MM-DD HH:mm:ss")
      : null;

    var obj = {
      from_date: this.from_date,
      to_date: this.to_date,
      gender: this.gender,
      status: this.status,
    };

    this.reportsService.generatePatientReport(obj).subscribe((data) => {
      if (data.status) {
        this.patient_data = [];
        this.patient_data = data.patient_summary;
      }
    });
  }

  onClearDates() {
    this.rangeDates = undefined;
  }

  printReport() {
    const printContents =
      document.getElementById("stockReportTable")?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "", "height=800,width=1200");
    printWindow?.document.write(`
    <html>
      <head>
        <title>Patient Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          table {
            border-collapse: collapse;
            width: 95%;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f3f4f6;
            font-weight: 600;
          }
          tr:nth-child(even) { background-color: #f9fafb; }
          .badge {
            padding: 4px 8px;
            border-radius: 8px;
            font-size: 12px;
          }
          .badge-primary { background-color: #3b82f6; color: white; }
          .badge-success { background-color: #22c55e; color: white; }
          .badge-danger { background-color: #ef4444; color: white; }
        </style>
      </head>
      <body>
        <h2 style="text-align:center;">Patient Report</h2>
        ${printContents}
      </body>
    </html>
  `);

    printWindow?.document.close();
    printWindow?.print();
  }
}
