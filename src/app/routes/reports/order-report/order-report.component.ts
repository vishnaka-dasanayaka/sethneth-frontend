import { Component } from "@angular/core";
import { SelectItem } from "primeng/api";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ReportsService } from "../../../core/_services/reports.service";
import { BranchesService } from "../../../core/_services/branches.service";
import swal from "sweetalert2";
import moment from "moment";

@Component({
  selector: "app-order-report",
  standalone: false,
  templateUrl: "./order-report.component.html",
  styleUrl: "./order-report.component.css",
})
export class OrderReportComponent {
  sysuser: any;
  LoadUI: boolean = false;

  from_date: any = null;
  to_date: any = null;
  branch: any[] = [];
  status: any[] = [];

  order_data: any[] = [];
  totals: any = {};

  branch_list: SelectItem[] = [];
  status_list: SelectItem[] = [
    { label: "Please select a status", value: null, disabled: true },
    { label: "Cancelled", value: -2 },
    { label: "Pending", value: 0 },
    { label: "Confirmed", value: 2 },
    { label: "Sent to the Workshop", value: 4 },
    { label: "Received from the Workshop", value: 6 },
    { label: "Delivered", value: 10 },
  ];

  rangeDates: Date[] | undefined;

  constructor(
    private authservice: AuthenticationService,
    private reportsService: ReportsService,
    private branchService: BranchesService,
  ) {}

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
      this.getDropdowns();
    });
  }

  generateReport() {
    if (this.branch == null || this.branch.length == 0 || this.status == null || this.status.length == 0) {
      swal.fire({
        title: "Warning!",
        text: "Branch and Status are mandatory ",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }

    if (this.rangeDates && (this.rangeDates[0] == null || this.rangeDates[1] == null)) {
      swal.fire({
        title: "Warning!",
        text: "Invalid Date Range",
        icon: "warning",
        confirmButtonColor: "#ff820d",
      });
      return;
    }

    this.from_date = this.rangeDates ? moment(this.rangeDates[0]).startOf("day").format("YYYY-MM-DD HH:MM:ss") : null;
    this.to_date = this.rangeDates ? moment(this.rangeDates[1]).endOf("day").format("YYYY-MM-DD HH:mm:ss") : null;

    var obj = {
      from_date: this.from_date,
      to_date: this.to_date,
      branch: this.branch,
      status: this.status,
    };

    this.reportsService.generateOrderReport(obj).subscribe((data) => {
      if (data.status) {
        this.order_data = [];
        this.order_data = data.order_summary;
        this.totals = data.totals;
      }
    });
  }

  getDropdowns() {
    this.branchService.getAllActiveBranches().subscribe((data) => {
      if (data.status) {
        this.branch_list = [
          { label: "Please select a branch", value: null, disabled: true },
          ...data.branches.map((item: any) => ({
            label: item.name,
            value: item.id,
          })),
        ];
      }
    });
  }

  onClearDates() {
    this.rangeDates = undefined;
  }

  printReport() {
    const printContents = document.getElementById("stockReportTable")?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "", "height=800,width=1200");
    printWindow?.document.write(`
    <html>
      <head>
        <title>Stock Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
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
        <h2 style="text-align:center;">Stock Report</h2>
        ${printContents}
      </body>
    </html>
  `);

    printWindow?.document.close();
    printWindow?.print();
  }
}
