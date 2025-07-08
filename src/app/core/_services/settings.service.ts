import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { GlobalVariable } from "./globals";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class SettingsService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/settings/";

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("SettingsService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  // supplier configs

  createSupplier(obj: any) {
    let APIurl = this.BaseAPIurl + "supplier/create-supplier";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllSuppliers(obj: any) {
    let APIurl = this.BaseAPIurl + "supplier/get-all-paged-suppliers";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getSupplier(id: number) {
    let APIurl = this.BaseAPIurl + "supplier/" + id;

    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  updateStatus(obj: any) {
    let APIurl = this.BaseAPIurl + "supplier/update-status";

    return this.http.patch<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getActiveSuppliers() {
    let APIurl = this.BaseAPIurl + "supplier/get-active-suppliers";

    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getPOsPerSupplier(obj: any) {
    let APIurl = this.BaseAPIurl + "supplier/get-purchase-orders-per-supplier";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // stock configs
  createPurchaseOrder(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/create-purchase-order";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllPurchaseOrders(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/get-all-paged-purchase-orders";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getPurchaseOrder(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/get-purchase-order";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  updatePOStatus(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/update-po-status";

    return this.http.patch<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // Stock Category

  createCategory(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/create-category";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllCategories(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/get-all-paged-categories";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  updateCategorystatus(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/update-category-status";

    console.log(obj);

    return this.http.patch<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  createBrand(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/create-brand";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getActiveCategories() {
    let APIurl = this.BaseAPIurl + "stock/get-active-categories";

    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllBrands(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/get-all-paged-brands";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
}
