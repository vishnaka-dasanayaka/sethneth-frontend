import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
import { SharedService } from "../../../core/_services/shared.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { ToastrService } from "ngx-toastr";
import { BranchesService } from "../../../core/_services/branches.service";
@Component({
  selector: "app-bulk-stock-transfer-modal",
  standalone: false,
  templateUrl: "./bulk-stock-transfer-modal.component.html",
  styleUrl: "./bulk-stock-transfer-modal.component.css",
})
export class BulkStockTransferModalComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();
  uniqueid: string = "";

  branches: SelectItem[] = [];
  stocks: SelectItem[] = [];

  valForm: FormGroup;

  showModal: boolean = false;
  clickEventSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private branchService: BranchesService,
  ) {
    this.valForm = this.fb.group({
      from_stock_id: [null, Validators.required],
      to_stock_id: [null, Validators.required],
      target_branch_id: [null, Validators.required],
    });

    this.clickEventSubscription = this.sharedService
      .getBulkStockTransferClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {}

  openModal() {
    this.showModal = true;
    this.getBranches();
    this.getActiveStocks();
  }

  getBranches() {
    this.branchService.getAllActiveBranches().subscribe((data) => {
      if (data.status) {
        this.branches = [];
        this.branches.push({
          label: "Please select a branch",
          value: null,
          disabled: true,
        });

        for (var item of data.branches) {
          this.branches.push({
            label: item.code + " - " + item.name,
            value: item.id,
          });
        }
      }
    });
  }

  getActiveStocks() {
    this.settingsService.getAllActiveModelsWithStock().subscribe((data) => {
      if (data.status) {
        this.stocks = [];
        this.stocks.push({
          label: "Please select a stock",
          value: null,
          disabled: true,
        });

        for (var item of data.models) {
          this.stocks.push({
            label: item.code,
            value: item.id,
          });
        }
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.valForm.reset();
  }

  submitForm(value: any) {
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid) {
      value.uniquekey = this.uniqueid;

      this.settingsService.transferBulkStock(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Stock has been transferred successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });
          } else {
            this.toastr.warning(data.err, "ERROR !!", {
              positionClass: "toast-top-right",
              closeButton: true,
            });
            this.generateUniqueKey();
          }
        },
        (error) => {
          alert("API ERROR [ERRCODE:001]");
        },
      );
    }
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }
}
