import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ReportsService } from "../../../core/_services/reports.service";
import { SelectItem } from "primeng/api";
import swal from "sweetalert2";
import { UserService } from "../../../core/_services/user.service";

@Component({
  selector: "app-user-report",
  standalone: false,
  templateUrl: "./user-report.component.html",
  styleUrl: "./user-report.component.css",
})
export class UserReportComponent {
  sysuser: any;
  LoadUI: boolean = false;

  userlevel: any[] = [];
  status: any[] = [];

  user_data: any[] = [];

  userlevel_list: SelectItem[] = [];
  status_list: SelectItem[] = [
    { label: "Please select a status", value: null, disabled: true },
    { label: "Active", value: 0 },
    { label: "Disabled", value: 1 },
  ];

  constructor(
    private authservice: AuthenticationService,
    private reportsService: ReportsService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
      this.getDropdowns();
    });
  }

  generateReport() {
    if (
      this.userlevel == null ||
      this.userlevel.length == 0 ||
      this.status == null ||
      this.status.length == 0
    ) {
      swal.fire({
        title: "Warning!",
        text: "User level and Status are mandetory",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }

    var obj = {
      userlevel: this.userlevel,
      status: this.status,
    };

    this.reportsService.generateUserReport(obj).subscribe((data) => {
      if (data.status) {
        this.user_data = [];
        this.user_data = data.user_summary;
      }
    });
  }

  getDropdowns() {
    this.userService.getUserLevels().subscribe((data) => {
      if (data.status) {
        this.userlevel_list = [];

        this.userlevel_list.push({
          label: "Please select a user level",
          value: null,
          disabled: true,
        });

        for (var item of data.userlevels) {
          this.userlevel_list.push({ label: item.rolename, value: item.id });
        }
      }
    });
  }

  printReport() {
    const printContents =
      document.getElementById("stockReportTable")?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "", "height=800,width=1200");
    printWindow?.document.write(`
      <html>
        <head>
          <title>User Report</title>
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
          <h2 style="text-align:center;">User Report</h2>
          ${printContents}
        </body>
      </html>
    `);

    printWindow?.document.close();
    printWindow?.print();
  }
}
