import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AttendanceDetailComponent } from "./attendance-detail/attendance-detail.component";
import { SharedModule } from "../../shared/shared.module";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "attendance-details", component: AttendanceDetailComponent },
];

@NgModule({
  declarations: [AttendanceDetailComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrModule {}
