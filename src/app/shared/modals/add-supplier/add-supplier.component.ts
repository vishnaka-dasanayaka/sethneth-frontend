import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import { ModalDirective } from "ngx-bootstrap/modal";
import { SharedService } from "../../../core/_services/shared.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-add-supplier",
  standalone: false,
  templateUrl: "./add-supplier.component.html",
  styleUrl: "./add-supplier.component.css",
})
export class AddSupplierComponent {
  sysuser: any;
  uniqueid: string = "";

  clickEventsubscription: Subscription | undefined;

  @ViewChild("addSupplierModal")
  public addSupplierModal!: ModalDirective;

  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  valForm: FormGroup;

  constructor(private sharedService: SharedService) {
    this.clickEventsubscription = this.sharedService
      .getAddSupplierClickEvent()
      .subscribe(() => {
        this.openModal();
        this.generateuniquekey();
      });

    const fb = inject(FormBuilder);
    this.valForm = fb.group({
      supplier_name: ["", Validators.required],
      contact_person: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
    });
  }

  openModal() {
    this.addSupplierModal?.show();
  }

  closeModal() {
    this.addSupplierModal?.hide();
  }

  submitForm() {
    if (this.valForm.valid) {
      this.parentFun.emit(this.valForm.value);
      this.valForm.reset();
      this.closeModal();
    }
  }

  generateuniquekey() {
    var num1 = new Date().valueOf();
    var num2 = Math.random().toString(36).substring(7);
    this.uniqueid = num1 + num2;
  }
}
