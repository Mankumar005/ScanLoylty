import { Injectable } from '@angular/core';
import { httpRequstService } from '../auth-services/http-request.service';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class CustomerTranstionHistoryService {

    constructor(private _httpService : httpRequstService) { }


      public getCompanyData(customer_unique_id:any): Observable<any>{
        return this._httpService.get(`customer-transaction-history/customer/company?search=&customer_unique_id=${customer_unique_id}&order_by=id&sort_by=DESC`);
      }                             
  
      public getBranchData(payloadObj:any): Observable<any>{
          return this._httpService.get(`customer-transaction-history/customer/branch?search=&customer_unique_id=${payloadObj.customer_unique_id}&company_id=${payloadObj.company_id}&order_by=id&sort_by=DESC`);
      }
  
      public getCycleData(payloadObj:any): Observable<any>{
      return this._httpService.get(`customer-transaction-history/customer/cycle?customer_unique_id=${payloadObj.customer_unique_id}&company_id=${payloadObj.company_id}&branch_id=${payloadObj.branch_id}&order_by=id&sort_by=DESC`);
      }
      
      public getStempData(payloadObj:any): Observable<any>{
      return this._httpService.get(`customer-transaction-history/customer/cycle-stamp?customer_unique_id=${payloadObj.customer_unique_id}&company_id=${payloadObj.company_id}&customer_cycle_id=${payloadObj.customer_cycle_id}&branch_id=${payloadObj.branch_id}&page_no=1&per_page=10&order_by=id&sort_by=DESC`);
      }
}
