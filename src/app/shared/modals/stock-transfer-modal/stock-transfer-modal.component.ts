import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Subscription } from "rxjs";
import swal from "sweetalert2";
import { SharedService } from "../../../core/_services/shared.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { CustomValidators } from "../../validators/custom-validators";
import { BranchesService } from "../../../core/_services/branches.service";

@Component({
  selector: "app-stock-transfer-modal",
  standalone: false,
  templateUrl: "./stock-transfer-modal.component.html",
  styleUrl: "./stock-transfer-modal.component.css",
})
export class StockTransferModalComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();
  uniqueid: string = "";

  stock: any;
  branches: SelectItem[] = [];

  valForm: FormGroup;

  showModal: boolean = false;
  clickEventSubscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private router: Router,
    private branchService: BranchesService,
  ) {
    this.valForm = this.fb.group({
      stock_id: [null, Validators.required],
      target_branch_id: [null, Validators.required],
      transfer_amount: [
        null,
        [Validators.required, CustomValidators.noDecimal],
      ],
    });

    this.clickEventSubscription = this.sharedService
      .getStockTransferClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  ngOnInit(): void {}

  openModal() {
    this.stock = this.sharedService.getStockTransferData().stock;
    this.valForm.patchValue({ stock_id: this.stock.id });
    this.showModal = true;
    this.getBranches();
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
          if (item.id == this.stock.branch.id) {
            this.branches.push({
              label: item.code + " - " + item.name,
              value: item.id,
              disabled: true,
            });
          } else {
            this.branches.push({
              label: item.code + " - " + item.name,
              value: item.id,
            });
          }
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

      this.settingsService.transferStock(value).subscribe(
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
