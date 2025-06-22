import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettiingsMenuComponent } from "./settiings-menu/settiings-menu.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  // Client paths
  { path: "settings-menu", component: SettiingsMenuComponent },
];

@NgModule({
  declarations: [SettiingsMenuComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsModule {}
