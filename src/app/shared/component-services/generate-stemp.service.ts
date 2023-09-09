import { Injectable } from '@angular/core';
import { httpRequstService } from '../auth-services/http-request.service';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class GenerateStempService {

    constructor(private _httpService : httpRequstService) { }
 
    public saveGenerateStampData(data:any): Observable<any>{
      return this._httpService.post(`stampcycle/store`,data);
    }

    public saveOfferImage(data:any): Observable<any>{
      return this._httpService.post(`stampcycle/image-store`,data);
    }

    public getGenerateStampAllData(compnay_id:any): Observable<any>{
      return this._httpService.get(`stampcycle?search=&order_by=id&sort_by=DESC&company_id=${compnay_id}&branch_id=`);
    }

    public getGenerateStampDataById(id:any): Observable<any>{
      return this._httpService.get(`stampcycle/${id}`);
    }

    public getCompanyList(): Observable<any> {
      return this._httpService.get(`companies?search&order_by=company_name&sort_by=ASC`);
    }
    
}
