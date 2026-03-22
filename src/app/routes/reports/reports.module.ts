import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReportsSummaryComponent } from "./reports-summary/reports-summary.component";
import { SharedModule } from "../../shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { StockReportComponent } from "./stock-report/stock-report.component";
import { UserReportComponent } from "./user-report/user-report.component";
import { PatientReportComponent } from "./patient-report/patient-report.component";
import { SupplierReportComponent } from "./supplier-report/supplier-report.component";
import { OrderReportComponent } from "./order-report/order-report.component";

const routes: Routes = [
  { path: "report-summary", component: ReportsSummaryComponent },
  { path: "stock-report", component: StockReportComponent },
  { path: "user-report", component: UserReportComponent },
  { path: "patient-report", component: PatientReportComponent },
  { path: "supplier-report", component: SupplierReportComponent },
  { path: "order-report", component: OrderReportComponent },
];

@NgModule({
  declarations: [
    ReportsSummaryComponent,
    StockReportComponent,
    UserReportComponent,
    PatientReportComponent,
    SupplierReportComponent,
    OrderReportComponent,
  ],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsModule {}
