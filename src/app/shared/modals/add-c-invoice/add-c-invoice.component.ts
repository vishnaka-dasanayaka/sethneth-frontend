import { Component, EventEmitter, Output } from "@angular/core";
import { SharedService } from "../../../core/_services/shared.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { SelectItem } from "primeng/api";
import { PatientsService } from "../../../core/_services/patients.service";
import { InvoiceService } from "../../../core/_services/invoice.service";
import { Router } from "@angular/router";
import { SettingsService } from "../../../core/_services/settings.service";

@Component({
  selector: "app-add-c-invoice",
  standalone: false,
  templateUrl: "./add-c-invoice.component.html",
  styleUrl: "./add-c-invoice.component.css",
})
export class AddCInvoiceComponent {
  @Output() parentFun: EventEmitter<any> = new EventEmitter();

  valForm: FormGroup;
  uniqueid: string = "";
  showModal: boolean = false;

  clickEventSubscription: Subscription;

  patients: SelectItem[] = [];
  cons_types: SelectItem[] = [];

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private patientService: PatientsService,
    private invoiceservice: InvoiceService,
    private router: Router,
    private settingsService: SettingsService
  ) {
    this.valForm = this.fb.group({
      patient: [null, Validators.required],
      cons_type: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, Validators.required],
      discounted_price: [null, Validators.required],
      discount: [null, Validators.required],
    });

    this.clickEventSubscription = this.sharedService
      .getAddInvoiceClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateUniqueKey();
      });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.valForm.reset();
  }

  ngOnInit(): void {
    this.getDropdowns();
  }

  submitForm(value: any) {
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid) {
      value.uniquekey = this.uniqueid;

      this.invoiceservice.createCInvoice(value).subscribe(
        (data) => {
          if (data.status) {
            this.parentFun.emit();
            this.closeModal();
            this.valForm.reset();
            swal.fire({
              title: "Success!",
              text: "Consultation invoice has been created successfully.",
              icon: "success",
              confirmButtonColor: "#28a745", // Optional: green color for success
            });

            this.router.navigate([
              "/c-invoices/c-invoice-details/" + data.inv.id,
            ]);
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
        }
      );
    }
  }

  generateUniqueKey() {
    const timestamp = new Date().valueOf();
    const random = Math.random().toString(36).substring(2);
    this.uniqueid = `${timestamp}${random}`;
  }

  getDropdowns() {
    this.patientService.getAllActivePatients().subscribe(
      (data) => {
        if (data.status) {
          this.patients = [];

          this.patients.push({
            label: "Please Select a patient",
            value: null,
            disabled: true,
          });

          for (var item of data.patients) {
            this.patients.push({
              label: item.code + " | " + item.name,
              value: item.id,
            });
          }
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
      }
    );

    this.settingsService.getAllActiveConsTypes().subscribe(
      (data) => {
        if (data.status) {
          this.cons_types = [];

          this.cons_types.push({
            label: "Please Select a consultation type",
            value: null,
            disabled: true,
          });

          for (var item of data.cons_types) {
            this.cons_types.push({
              label: item.type,
              value: item.id,
            });
          }
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
      }
    );
  }

  updatePrice() {
    var discount = this.valForm.get("discount")?.value;
    var price = this.valForm.get("price")?.value;

    this.valForm.patchValue({ discounted_price: price - discount });
  }
}
