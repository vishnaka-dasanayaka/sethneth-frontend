import { Component } from "@angular/core";
import { AuthenticationService } from "../core/_services/authentication.service";
import { SettingsService } from "../core/_services/settings.service";

@Component({
  selector: "app-layout",
  standalone: false,
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.css",
})
export class LayoutComponent {
  sysuser: any;
  private sub: any;

  selected_branch: number = 1;

  constructor(
    private authenticationService: AuthenticationService,
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.sub = this.authenticationService
      .validateUser()
      .subscribe((sysuser) => {
        this.sysuser = sysuser;
      });
  }

  OK() {
    this.settingsService.branchConfirm().subscribe((data) => {
      if (data.status) {
        this.authenticationService.validateUser().subscribe((sysuser) => {
          this.sysuser = sysuser;
        });
      }
    });
  }
}
