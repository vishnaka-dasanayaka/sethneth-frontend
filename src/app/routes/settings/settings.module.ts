import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettiingsMenuComponent } from "./settiings-menu/settiings-menu.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { SupplierDetailComponent } from "./supplier-detail/supplier-detail.component";
import { SupplierSummaryComponent } from "./supplier-summary/supplier-summary.component";
import { StockSettingsComponent } from "./stock-settings/stock-settings.component";
import { PurchaseOrderSummaryComponent } from "./purchase-order-summary/purchase-order-summary.component";
import { PurchaseOrderDetailComponent } from "./purchase-order-detail/purchase-order-detail.component";
import { StockConfigComponent } from "./stock-config/stock-config.component";
import { StockCategoriesComponent } from "./stock-categories/stock-categories.component";
import { BrandsComponent } from "./brands/brands.component";
import { ModelsComponent } from "./models/models.component";
import { StockSummaryComponent } from "./stock-summary/stock-summary.component";
import { StockDetailComponent } from "./stock-detail/stock-detail.component";
import { LensesComponent } from "./lenses/lenses.component";

const routes: Routes = [
  // Client paths
  { path: "settings-menu", component: SettiingsMenuComponent },
  { path: "stock-settings", component: StockSettingsComponent },
  { path: "stock-config", component: StockConfigComponent },
  { path: "supplier-summary", component: SupplierSummaryComponent },
  { path: "supplier-details/:id", component: SupplierDetailComponent },
  { path: "purchase-order-summary", component: PurchaseOrderSummaryComponent },
  { path: "stock-categories", component: StockCategoriesComponent },
  { path: "brands", component: BrandsComponent },
  { path: "models", component: ModelsComponent },
  { path: "lenses", component: LensesComponent },
  { path: "stock-summary", component: StockSummaryComponent },
  {
    path: "purchase-order-details/:id",
    component: PurchaseOrderDetailComponent,
  },
  { path: "stock-details/:id", component: StockDetailComponent },
];

@NgModule({
  declarations: [
    SettiingsMenuComponent,
    StockSettingsComponent,
    SupplierSummaryComponent,
    SupplierDetailComponent,
    PurchaseOrderSummaryComponent,
    PurchaseOrderDetailComponent,
    StockConfigComponent,
    StockCategoriesComponent,
    BrandsComponent,
    ModelsComponent,
    StockSummaryComponent,
    StockDetailComponent,
    LensesComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class SettingsModule {}
