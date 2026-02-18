import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../core/_services/authentication.service";
import { SelectItem } from "primeng/api";
import { BranchesService } from "../../core/_services/branches.service";
import { SettingsService } from "../../core/_services/settings.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-header",
  standalone: false,
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  sysuser: any;
  private sub: any;

  branches: SelectItem[] = [];
  selected_branch: number = 1;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private branchService: BranchesService,
    private settingsService: SettingsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.sub = this.authenticationService
      .validateUser()
      .subscribe((sysuser) => {
        this.sysuser = sysuser;
        this.getBranches();
        this.selected_branch = sysuser.branch.id;

        // if (
        //   this.sysuser.app_settings.admin_settings.header_name &&
        //   this.sysuser.app_settings.admin_settings.header_name != null
        // ) {
        //   this.header_name = this.sysuser.app_settings.admin_settings.header_name;
        // }
        // if (
        //   this.sysuser.app_settings.admin_settings.header_name &&
        //   this.sysuser.app_settings.admin_settings.header_name != null
        // ) {
        //   this.titleService.setTitle(
        //     this.sysuser.app_settings.admin_settings.index_page_name
        //   );
        // } else {
        //   this.titleService.setTitle("SISKA");
        // }
        // if (
        //   this.settings.getAppSetting("version") <
        //   sysuser.codevus_settings[0].s_key
        // ) {
        //   //check for updates
        //   this.blockUI.start(
        //     "Upgrade to the newest, improved version of our software now!  Installing version " +
        //       sysuser.codevus_settings[0].s_key +
        //       " in a moment.."
        //   );
        //   setTimeout(function () {
        //     location.reload();
        //   }, 5000);
        // }
      });
  }

  changeBranchForSession() {
    this.settingsService
      .setSessionBranch({ branch_id: this.selected_branch })
      .subscribe((data) => {
        if (data.status) {
          this.toastr.success("Branch Saved", "Success", {
            positionClass: "toast-top-right",
            closeButton: true,
            timeOut: 3000,
            progressBar: true,
            toastClass: "toast toast-sm", // <-- add your small class here
          });

          window.location.reload();
        }
      });
  }

  getBranches() {
    this.branchService.getAllActiveBranches().subscribe((data) => {
      if (data.status) {
        for (var item of data.branches) {
          this.branches.push({
            value: item.id,
            label: item.code + " - " + item.name,
          });
        }
      }
    });
  }
}
