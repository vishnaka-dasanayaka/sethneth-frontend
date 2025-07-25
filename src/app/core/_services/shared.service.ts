import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class SharedService {
  // Supplier
  private add_supplier = new Subject<void>();
  private edit_supplier = new Subject<any>();
  private supplier_data: any = undefined;

  setSupplierData(data: any) {
    this.supplier_data = data;
  }
  openAddSupplierModal() {
    this.add_supplier.next();
  }
  getAddSupplierClickEvent(): Observable<any> {
    return this.add_supplier.asObservable();
  }
  getSupplierData(): any {
    return this.supplier_data;
  }

  // openEditClientModal() {
  //   this.edit_supplier.next();
  // }

  // getEditClientClickEvent(): Observable<any> {
  //   return this.edit_supplier.asObservable();
  // }

  // Purchase Order

  private add_purchase_order = new Subject<void>();
  private edit_purchase_order = new Subject<any>();
  private purchase_order_data: any = undefined;

  setPurchaseOrderData(data: any) {
    this.purchase_order_data = data;
  }
  openAddPurchaseOrderModal() {
    this.add_purchase_order.next();
  }
  getAddPurchaseOrderClickEvent(): Observable<any> {
    return this.add_purchase_order.asObservable();
  }
  getPurchaseOrderData(): any {
    return this.purchase_order_data;
  }

  // openEditClientModal() {
  //   this.edit_supplier.next();
  // }

  // getEditClientClickEvent(): Observable<any> {
  //   return this.edit_supplier.asObservable();
  // }

  // Stock Category

  private add_category = new Subject<void>();
  private edit_category = new Subject<any>();
  private category_data: any = undefined;

  setCategoryData(data: any) {
    this.category_data = data;
  }
  openAddCategoryModal() {
    this.add_category.next();
  }
  getAddCategoryClickEvent(): Observable<any> {
    return this.add_category.asObservable();
  }
  getCategoryData(): any {
    return this.category_data;
  }

  // openEditClientModal() {
  //   this.edit_supplier.next();
  // }

  // getEditClientClickEvent(): Observable<any> {
  //   return this.edit_supplier.asObservable();
  // }

  // Brand

  private add_brand = new Subject<void>();
  private edit_brand = new Subject<any>();
  private brand_data: any = undefined;

  setBrandData(data: any) {
    this.brand_data = data;
  }
  openAddBrandModal() {
    this.add_brand.next();
  }
  getAddBrandClickEvent(): Observable<any> {
    return this.add_brand.asObservable();
  }
  getBrandyData(): any {
    return this.brand_data;
  }

  // openEditClientModal() {
  //   this.edit_supplier.next();
  // }

  // getEditClientClickEvent(): Observable<any> {
  //   return this.edit_supplier.asObservable();
  // }

  // Brand

  private add_model = new Subject<void>();
  private edit_model = new Subject<any>();
  private model_data: any = undefined;

  setModelData(data: any) {
    this.model_data = data;
  }
  openAddModelModal() {
    this.add_model.next();
  }
  getAddModelClickEvent(): Observable<any> {
    return this.add_model.asObservable();
  }
  getModelyData(): any {
    return this.model_data;
  }

  // openEditClientModal() {
  //   this.edit_supplier.next();
  // }

  // getEditClientClickEvent(): Observable<any> {
  //   return this.edit_supplier.asObservable();
  // }

  // Stock

  private add_stock = new Subject<void>();
  private edit_stock = new Subject<any>();
  private stock_data: any = undefined;

  setStockData(data: any) {
    this.stock_data = data;
  }
  openAddStockModal() {
    this.add_stock.next();
  }
  getAddStockClickEvent(): Observable<any> {
    return this.add_stock.asObservable();
  }
  getStockData(): any {
    return this.stock_data;
  }

  // openEditClientModal() {
  //   this.edit_supplier.next();
  // }

  // getEditClientClickEvent(): Observable<any> {
  //   return this.edit_supplier.asObservable();
  // }

  // Patients

  private add_patient = new Subject<void>();
  private edit_patient = new Subject<any>();
  private patient_data: any = undefined;

  setPatientData(data: any) {
    this.patient_data = data;
  }
  openAddPatientModal() {
    this.add_patient.next();
  }
  getAddPatientClickEvent(): Observable<any> {
    return this.add_patient.asObservable();
  }
  getPatientData(): any {
    return this.patient_data;
  }

  // openEditClientModal() {
  //   this.edit_supplier.next();
  // }

  // getEditClientClickEvent(): Observable<any> {
  //   return this.edit_supplier.asObservable();
  // }
}
