import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { ReportsService } from "../../../core/_services/reports.service";

@Component({
  selector: "app-stock-report",
  standalone: false,
  templateUrl: "./stock-report.component.html",
  styleUrl: "./stock-report.component.css",
})
export class StockReportComponent implements OnInit {
  sysuser: any;
  LoadUI: boolean = false;

  constructor(
    private authservice: AuthenticationService,
    private reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });

    this.generateReport();
  }

  from_date: String = "";
  to_date: String = "";
  supplier: any[] = [];
  brand: any[] = [];
  model: any[] = [];

  stock_data: any[] = [];

  generateReport() {
    var obj = {
      from_date: this.from_date,
      to_date: this.to_date,
      supplier: this.supplier,
      brand: this.brand,
      model: this.model,
    };

    this.reportsService.generateStockReport(obj).subscribe((data) => {
      if (data.status) {
        this.stock_data = [];
        this.stock_data = data.stock_summary;
      }
    });
  }
}
