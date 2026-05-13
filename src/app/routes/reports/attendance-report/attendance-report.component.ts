import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ReportsService } from "../../../core/_services/reports.service";
import { SelectItem } from "primeng/api";
import swal from "sweetalert2";
import moment from "moment";
import { UserService } from "../../../core/_services/user.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-attendance-report",
  standalone: false,
  templateUrl: "./attendance-report.component.html",
  styleUrl: "./attendance-report.component.css",
})
export class AttendanceReportComponent {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  user: any = null;

  total_records: any[] = [];

  user_list: SelectItem[] = [];
  month: any = null;

  constructor(
    private authservice: AuthenticationService,
    private reportsService: ReportsService,
    private userService: UserService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
    this.getDropdowns();
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  getDropdowns() {
    this.userService.getUserList({ disabled: 0 }).subscribe(
      (data) => {
        if (data.status) {
          this.user_list = [];

          this.user_list.push({
            label: "Please Select a user",
            value: null,
            disabled: true,
          });

          for (var item of data.users) {
            if (item.id != 1) {
              this.user_list.push({
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
  }

  generateReport() {
    if (this.user == null || this.user.length == 0) {
      swal.fire({
        title: "Warning!",
        text: "user is mandatory ",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }

    if (this.month == null) {
      swal.fire({
        title: "Warning!",
        text: "month is mandatory ",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }

    const obj = {
      user_list: this.user,
      month: this.month.getMonth() + 1,
      year: this.month.getFullYear(),
    };

    this.reportsService.generateAttendanceReport(obj).subscribe((data) => {
      if (data.status) {
        this.total_records = [];
        console.log(data);
        this.total_records = data.attendance_summary;
      }
    });
  }

  onClearDates() {
    this.month = undefined;
  }

  printReport() {
    const printContents = document.getElementById("stockReportTable")?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "", "height=800,width=1200");
    printWindow?.document.write(`
        <html>
          <head>
            <title>Supplier Report</title>
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
            <h2 style="text-align:center;">Supplier Report</h2>
            ${printContents}
          </body>
        </html>
      `);

    printWindow?.document.close();
    printWindow?.print();
  }
}
