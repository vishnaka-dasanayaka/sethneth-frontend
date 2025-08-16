import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoiceSummaryComponent } from "./invoice-summary/invoice-summary.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "primeng/api";

const routes: Routes = [
  { path: "invoice-summary", component: InvoiceSummaryComponent },
  // { path: "order-details/:id", component: OrderDetailComponent },
];

@NgModule({
  declarations: [InvoiceSummaryComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesModule {}
