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
export class HrService {
  private BaseAPIurl = GlobalVariable.BaseUrl + "api/v1/hr/";

  constructor(private http: HttpClient) {}

  // error checking handler for api response and trigger errors
  private handleError(error: HttpErrorResponse | any) {
    console.error("HrService::handleError", error);
    return throwError(() => error); // This is the correct way in RxJS 7+
  }

  addCheckin(obj: any) {
    let APIurl = this.BaseAPIurl + "add-checkin";
    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  addCheckout(obj: any) {
    let APIurl = this.BaseAPIurl + "add-checkout";
    return this.http.post<any>(APIurl, obj).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }

  getLastCheckin() {
    let APIurl = this.BaseAPIurl + "get-last-checkin";
    return this.http.get<any>(APIurl).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError),
    );
  }
}
