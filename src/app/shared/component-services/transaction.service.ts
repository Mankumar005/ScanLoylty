import { Injectable } from '@angular/core';
import { httpRequstService } from '../auth-services/http-request.service';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class TransactionService {

    constructor(private _httpService : httpRequstService) { }


    public getCustomeTransactionHistoryByID(company_id:number,branch_id:number): Observable<any>{
      return this._httpService.get(`stemp-history?company_id=${company_id}&branch_id=${branch_id}&order_by=id&sort_by=DESC`);
    }
 
}
