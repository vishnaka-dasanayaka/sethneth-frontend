import { Component } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SharedService } from "../../../core/_services/shared.service";

@Component({
  selector: "app-supplier-config",
  standalone: false,
  templateUrl: "./supplier-config.component.html",
  styleUrl: "./supplier-config.component.css",
})
export class SupplierConfigComponent {
  sysuser: any;
  LoadUI: boolean = false;

  constructor(
    private authservice: AuthenticationService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;
    });
  }

  openAddModal() {
    console.log("hh");

    this.sharedService.setSupplierData({ navigate: true });
    this.sharedService.openAddSupplierModal();
  }
}
