import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettiingsMenuComponent } from "./settiings-menu/settiings-menu.component";
import { RouterModule, Routes } from "@angular/router";
import { StockConfigComponent } from "./stock-config/stock-config.component";
import { SharedModule } from "../../shared/shared.module";
import { SupplierDetailComponent } from "./supplier-detail/supplier-detail.component";
import { SupplierSummaryComponent } from "./supplier-summary/supplier-summary.component";

const routes: Routes = [
  // Client paths
  { path: "settings-menu", component: SettiingsMenuComponent },
  { path: "stock-config", component: StockConfigComponent },
  { path: "supplier-summary", component: SupplierSummaryComponent },
  { path: "supplier-details/:id", component: SupplierDetailComponent },
];

@NgModule({
  declarations: [
    SettiingsMenuComponent,
    StockConfigComponent,
    SupplierSummaryComponent,
    SupplierDetailComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class SettingsModule {}
