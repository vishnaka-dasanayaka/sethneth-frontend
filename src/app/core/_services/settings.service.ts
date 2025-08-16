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

    return this.http.patch<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  updateLensestatus(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/update-lense-status";

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

  getActiveBrands() {
    let APIurl = this.BaseAPIurl + "stock/get-active-brands";

    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  createModel(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/create-model";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllActiveModelsWithStock() {
    let APIurl = this.BaseAPIurl + "stock/get-all-active-models-with-stock";

    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllActiveLenses() {
    let APIurl = this.BaseAPIurl + "stock/get-all-active-lenses";

    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  createStock(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/create-stock";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllModels(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/get-all-paged-models";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllLenses(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/get-all-paged-lenses";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllStocks(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/get-all-paged-stocks";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getActiveBrandsPerCategory(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/get-active-brands-per-category";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getActiveModelsPerBrand(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/get-active-models-per-brand";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getActivePurchaseOrdersPerSupplier(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/get-active-po-per-supplier";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getStock(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/get-stock";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  updateStockStatus(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/update-stock-status";

    return this.http.patch<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  createLense(obj: any) {
    let APIurl = this.BaseAPIurl + "stock/create-lense";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
}
