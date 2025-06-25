import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettiingsMenuComponent } from "./settiings-menu/settiings-menu.component";
import { RouterModule, Routes } from "@angular/router";
import { StockConfigComponent } from "./stock-config/stock-config.component";
import { SharedModule } from "../../shared/shared.module";
import { SupplierConfigComponent } from "./supplier-config/supplier-config.component";

const routes: Routes = [
  // Client paths
  { path: "settings-menu", component: SettiingsMenuComponent },
  { path: "stock-config", component: StockConfigComponent },
  { path: "supplier-config", component: SupplierConfigComponent },
];

@NgModule({
  declarations: [
    SettiingsMenuComponent,
    StockConfigComponent,
    SupplierConfigComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class SettingsModule {}
