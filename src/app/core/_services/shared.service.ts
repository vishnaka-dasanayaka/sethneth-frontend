import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class SharedService {
  sanitizeFormValues(values: any): any {
    const cleanedValues: any = {};

    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        const value = values[key];

        if (typeof value === "string") {
          const trimmed = value.trim();
          cleanedValues[key] = trimmed === "" ? null : trimmed;
        } else {
          cleanedValues[key] = value;
        }
      }
    }

    return cleanedValues;
  }

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
  private edit_patient = new Subject<void>();
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

  openEditPatientModal() {
    this.edit_patient.next();
  }

  getEditPatientClickEvent(): Observable<any> {
    return this.edit_patient.asObservable();
  }

  // Brand

  private add_lense = new Subject<void>();
  private edit_lense = new Subject<any>();
  private lense_data: any = undefined;

  setLenselData(data: any) {
    this.lense_data = data;
  }
  openAddLenseModal() {
    this.add_lense.next();
  }
  getAddLenseClickEvent(): Observable<any> {
    return this.add_lense.asObservable();
  }
  getLenseyData(): any {
    return this.lense_data;
  }

  // openEditClientModal() {
  //   this.edit_supplier.next();
  // }

  // getEditClientClickEvent(): Observable<any> {
  //   return this.edit_supplier.asObservable();
  // }

  // Order
  private add_order = new Subject<void>();
  private edit_order = new Subject<void>();
  private order_data: any = undefined;

  setOrderData(data: any) {
    this.order_data = data;
  }
  openAddOrderModal() {
    this.add_order.next();
  }
  getAddOrderClickEvent(): Observable<any> {
    return this.add_order.asObservable();
  }
  getOrderData(): any {
    return this.order_data;
  }

  openEditOrderModal() {
    this.edit_order.next();
  }

  getEditOrderClickEvent(): Observable<any> {
    return this.edit_order.asObservable();
  }

  // Invoice Item
  private add_invoice_item = new Subject<void>();
  private edit_invoice_item = new Subject<any>();
  private invoice_item_data: any = undefined;

  setInvoiceItemData(data: any) {
    this.invoice_item_data = data;
  }
  openAddInvoiceItemModal() {
    this.add_invoice_item.next();
  }
  getAddInvoiceItemClickEvent(): Observable<any> {
    return this.add_invoice_item.asObservable();
  }
  getInvoiceItemData(): any {
    return this.invoice_item_data;
  }

  // openEditClientModal() {
  //   this.edit_supplier.next();
  // }

  // getEditClientClickEvent(): Observable<any> {
  //   return this.edit_supplier.asObservable();
  // }

  // Order
  private add_payment = new Subject<void>();
  private edit_payment = new Subject<any>();
  private payment_data: any = undefined;

  setPaymentData(data: any) {
    this.payment_data = data;
  }
  openAdPaymentrModal() {
    this.add_payment.next();
  }
  getAddPaymentClickEvent(): Observable<any> {
    return this.add_payment.asObservable();
  }
  getPaymentData(): any {
    return this.payment_data;
  }

  // openEditClientModal() {
  //   this.edit_supplier.next();
  // }

  // getEditClientClickEvent(): Observable<any> {
  //   return this.edit_supplier.asObservable();
  // }

  // Prescription
  private add_prescription = new Subject<void>();
  private edit_prescription = new Subject<any>();
  private view_prescription = new Subject<void>();
  private prescription_data: any = undefined;

  setPrescriptionData(data: any) {
    this.prescription_data = data;
  }
  openAddPrescriptionrModal() {
    this.add_prescription.next();
  }
  getAddPrescriptionClickEvent(): Observable<any> {
    return this.add_prescription.asObservable();
  }
  getPrescriptionData(): any {
    return this.prescription_data;
  }
  openViewPrescriptionrModal() {
    this.view_prescription.next();
  }
  getViewPrescriptionClickEvent(): Observable<any> {
    return this.view_prescription.asObservable();
  }

  // openEditClientModal() {
  //   this.edit_supplier.next();
  // }

  // getEditClientClickEvent(): Observable<any> {
  //   return this.edit_supplier.asObservable();
  // }

  // Invoice
  private add_invoice = new Subject<void>();
  private edit_invoice = new Subject<void>();
  private invoice_data: any = undefined;

  setInvoiceData(data: any) {
    this.invoice_data = data;
  }
  openAddInvoiceModal() {
    this.add_invoice.next();
  }
  getAddInvoiceClickEvent(): Observable<any> {
    return this.add_invoice.asObservable();
  }
  getInvoiceData(): any {
    return this.invoice_data;
  }

  openEditInvoiceModal() {
    this.edit_invoice.next();
  }

  getEditInvoiceClickEvent(): Observable<any> {
    return this.edit_invoice.asObservable();
  }
}
