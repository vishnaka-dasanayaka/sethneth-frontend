import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class SharedService {
  // client

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
}
