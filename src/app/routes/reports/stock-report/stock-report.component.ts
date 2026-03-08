import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ReportsService } from "../../../core/_services/reports.service";
import { BranchesService } from "../../../core/_services/branches.service";
import { SelectItem } from "primeng/api";
import { SettingsService } from "../../../core/_services/settings.service";
import swal from "sweetalert2";
import moment from "moment";

@Component({
  selector: "app-stock-report",
  standalone: false,
  templateUrl: "./stock-report.component.html",
  styleUrl: "./stock-report.component.css",
})
export class StockReportComponent implements OnInit {
  sysuser: any;
  LoadUI: boolean = false;

  from_date: any = null;
  to_date: any = null;
  supplier: any[] = [];
  brand: any[] = [];
  model: any[] = [];
  branch: any[] = [];
  status: any[] = [];

  stock_data: any[] = [];
  totals: any = {};

  branch_list: SelectItem[] = [];
  brand_list: SelectItem[] = [];
  supplier_list: SelectItem[] = [];
  model_list: SelectItem[] = [
    { label: "Select a brand first", value: null, disabled: true },
  ];
  status_list: SelectItem[] = [
    { label: "Please select a status", value: null, disabled: true },
    { label: "Approved", value: 2 },
    { label: "Rejected", value: -2 },
    { label: "Pending", value: 0 },
    { label: "Fully Transferred", value: 4 },
  ];
  rangeDates: Date[] | undefined;

  constructor(
    private authservice: AuthenticationService,
    private reportsService: ReportsService,
    private branchService: BranchesService,
    private settingsService: SettingsService,
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
      this.supplier == null ||
      this.supplier.length == 0 ||
      this.branch == null ||
      this.branch.length == 0 ||
      this.model == null ||
      this.model.length == 0 ||
      this.status == null ||
      this.status.length == 0
    ) {
      swal.fire({
        title: "Warning!",
        text: "Supplier, Branch, Brand, Model and Status are mandetory",
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
      supplier: this.supplier,
      brand: this.brand,
      model: this.model,
      branch: this.branch,
      status: this.status,
    };

    this.reportsService.generateStockReport(obj).subscribe((data) => {
      if (data.status) {
        this.stock_data = [];
        this.stock_data = data.stock_summary;
        this.totals = data.totals;
      }
    });
  }

  getDropdowns() {
    this.settingsService.getActiveSuppliers().subscribe((data) => {
      if (data.status) {
        this.supplier_list = [
          { label: "Please select a supplier", value: -1, disabled: true },
          { label: "TRANSFERRED", value: null },
          ...data.suppliers.map((item: any) => ({
            label: item.name,
            value: item.id,
          })),
        ];
      }
    });

    this.settingsService.getActiveBrands().subscribe((data) => {
      if (data.status) {
        this.brand_list = [
          { label: "Please select a brand", value: null, disabled: true },
          ...data.brands.map((item: any) => ({
            label: item.name,
            value: item.id,
          })),
        ];
      }
    });

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

  onBrandChange() {
    this.settingsService
      .getActiveModelsPerBrands({ brands: this.brand })
      .subscribe((data) => {
        if (data.status) {
          this.model_list = [
            { label: "Please select a model", value: null, disabled: true },
            ...data.models.map((item: any) => ({
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
    const printContents =
      document.getElementById("stockReportTable")?.innerHTML;
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
