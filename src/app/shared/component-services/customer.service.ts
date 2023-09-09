import { Injectable } from '@angular/core';
import { httpRequstService } from '../auth-services/http-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private _httpService : httpRequstService) { }

  public getCustomerList(company_id:any): Observable<any>{
    return this._httpService.get(`customers?search&company_id=${company_id}&sort_by=DESC`);
  }

  public getCustomerDataList(page,perPage): Observable<any>{
    return this._httpService.get(`branches?search=&company_id=2&city_id=&page_no=${page}&per_page=${perPage}&order_by=branch_name&sort_by=ASC`);
  }

  public getCustomerTransactionsList(): Observable<any>{
    return this._httpService.get(`companies?search&order_by=company_name&sort_by=ASC`);
  }

  public getCustomerDetailsByID(id:number): Observable<any>{
    return this._httpService.get(`customers/${id}`);
  }

  public getCustomeStempHistoryByID(customer_id:number,company_id:number,branch_id:number): Observable<any>{
    return this._httpService.get(`stemp-history?customer_id=${customer_id}&company_id=${company_id}&branch_id=${branch_id}&page_no=1&per_page=10&order_by=id&sort_by=ASC`);
  }

  public getCompanyByID(customer_id:number): Observable<any>{
    return this._httpService.get(`stemp-history/company-list?customer_id=${customer_id}`);
  }

  public getBranchByID(payloadObj:any): Observable<any>{
    return this._httpService.get(`stemp-history/branch-list?customer_id=${payloadObj.customer_id}&company_id=${payloadObj.company_id}`);
  }

}
