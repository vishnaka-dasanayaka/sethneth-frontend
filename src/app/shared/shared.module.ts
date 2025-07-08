import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  Inject,
  ModuleWithProviders,
  NgModule,
  PLATFORM_ID,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { BlockUIModule } from "ng-block-ui";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { QRCodeComponent } from "angularx-qrcode";
import { CardLoaderComponent } from "./card-loader/card-loader.component";
import { SkeletonModule } from "primeng/skeleton";
import { DatePickerModule } from "primeng/datepicker";
import { EventLoaderComponent } from "./event-loader/event-loader.component";
import { LOAD_WASM, NgxScannerQrcodeComponent } from "ngx-scanner-qrcode";
import { DropdownModule } from "primeng/dropdown";
import { LoginPopupComponent } from "./login-popup/login-popup.component";
import { TabsModule } from "primeng/tabs";
import { LoaderComponent } from "./loader/loader.component";
import { AddSupplierComponent } from "./modals/add-supplier/add-supplier.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { TableModule } from "primeng/table";

import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { EditorModule } from "primeng/editor";
import { AddPurchaseOrderComponent } from "./modals/add-purchase-order/add-purchase-order.component";
import { SelectModule } from "primeng/select";
import { AddCategoryComponent } from "./modals/add-category/add-category.component";
import { AddBrandComponent } from "./modals/add-brand/add-brand.component";
import { MultiSelectModule } from "primeng/multiselect";

@NgModule({
  imports: [
    BlockUIModule.forRoot(),
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    QRCodeComponent,
    SkeletonModule,
    DatePickerModule,
    NgxScannerQrcodeComponent,
    DropdownModule,
    ModalModule.forRoot(),
    TabsModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    EditorModule,
    SelectModule,
    MultiSelectModule,
  ],
  providers: [],
  declarations: [
    CardLoaderComponent,
    CardLoaderComponent,
    EventLoaderComponent,
    LoginPopupComponent,
    LoaderComponent,
    AddSupplierComponent,
    AddPurchaseOrderComponent,
    AddCategoryComponent,
    AddBrandComponent,
  ],
  exports: [
    BlockUIModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    QRCodeComponent,
    CardLoaderComponent,
    EventLoaderComponent,
    SkeletonModule,
    DatePickerModule,
    NgxScannerQrcodeComponent,
    DropdownModule,
    LoginPopupComponent,
    TabsModule,
    LoaderComponent,
    AddSupplierComponent,
    ModalModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    EditorModule,
    AddPurchaseOrderComponent,
    SelectModule,
    AddCategoryComponent,
    AddBrandComponent,
    MultiSelectModule,
  ],
})

// https://github.com/ocombe/ng2-translate/issues/209
export class SharedModule {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      LOAD_WASM("assets/wasm/ngx-scanner-qrcode.wasm").subscribe();
    }
  }

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    };
  }
}
