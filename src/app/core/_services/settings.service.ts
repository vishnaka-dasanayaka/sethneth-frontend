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
    let APIurl = this.BaseAPIurl + "supplier";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getAllSuppliers(obj: any) {
    let APIurl = this.BaseAPIurl + "supplier/all";

    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
}
