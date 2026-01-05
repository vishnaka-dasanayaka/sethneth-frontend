import { Component } from "@angular/core";
import swal from "sweetalert2";
import { AuthenticationService } from "../../../core/_services/authentication.service";

@Component({
  selector: "app-profile",
  standalone: false,
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent {
  uniqueid: any;
  sysuser: any;
  LoadUI: boolean = false;

  constructor(private authservice: AuthenticationService) {}

  ngOnInit(): void {
    this.generateUniqueKey();
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  // openInvoiceEditModal() {
  //   if (this.branch.status != 0) {
  //     swal.fire({
  //       title: "Warning!",
  //       text: "Order Should be in pending status to edit",
  //       icon: "warning",
  //       confirmButtonColor: "#ff820d",
  //     });
  //     return;
  //   }

  //   var obj = {
  //     patient_id: this.branch.patient_id.id,
  //     id: this.branch.id,
  //   };

  //   this.sharedService.setInvoiceData(obj);
  //   this.sharedService.openEditInvoiceModal();
  // }
}
