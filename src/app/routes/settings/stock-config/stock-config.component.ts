import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-stock-config",
  standalone: false,
  templateUrl: "./stock-config.component.html",
  styleUrl: "./stock-config.component.css",
})
export class StockConfigComponent implements OnInit {
  uniqueid: any;

  addBrandValForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.addBrandValForm = fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  generateuniquekey() {
    const num1 = new Date().valueOf();
    const num2 = Math.random().toString(36).substring(7);
    this.uniqueid = num1 + num2;
  }

  submitForm($ev: { preventDefault: () => void }, value: any) {
    $ev.preventDefault();
    for (const c in this.addBrandValForm.controls) {
      this.addBrandValForm.controls[c].markAsTouched();
    }
    if (this.addBrandValForm.valid) {
      value.uniquekey = this.uniqueid;
      // this.settingsService.addServiceType(value).subscribe(
      //   (data) => {
      //     if (data.status) {
      //       this.toastr.success("Service Type Created", "Success !!", {
      //         positionClass: "toast-top-right",
      //         closeButton: true,
      //       });
      //       this.addBrandValForm.reset();
      //       this.addBrandValForm.get("service_type").setValue("MAIN");
      //       this.addBrandValForm.get("service_for").setValue("INDIVIDUAL");
      //       this.getData();
      //       this.generateuniquekey();
      //     } else {
      //       this.toastr.warning(data.err, "ERROR !!", {
      //         positionClass: "toast-top-right",
      //         closeButton: true,
      //       });
      //       this.generateuniquekey();
      //     }
      //   },
      //   (error) => {
      //     alert("API ERROR [ERRCODE:001]");
      //   }
      // );
    }
  }
}
