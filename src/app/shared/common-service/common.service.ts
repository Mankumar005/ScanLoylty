import { Injectable } from '@angular/core';
import { httpRequstService } from '../auth-services/http-request.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private _httpService : httpRequstService) { }

  public getCountryList(): Observable<any>{
    return this._httpService.get(`countries?search=&page_no=&per_page=&order_by=&sort_by=`);
  }

  public getStateList(parmas: any): Observable<any> {
    return this._httpService.get(`states?sort_by=`);
  }

  public getCityList(id: any): Observable<any> {
    return this._httpService.get(`cities?page_no=&per_page=&order_by=&sort_by=`);
  }
  
  public addFiles(data:any): Observable<any> {
    return this._httpService.post(`companybranchfiles`,data);
  }

  public getAllCompanys(): Observable<any>{
    return this._httpService.get(`companies?search=&order_by=company_name&sort_by=DESC`);
  }

  public getBranchByID(payloadObj:any): Observable<any>{
    return this._httpService.get(`branches?search=&company_id=${payloadObj.company_id}&order_by=branch_name&sort_by=DESC`);
  }


}
