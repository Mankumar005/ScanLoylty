import { Injectable } from '@angular/core';
import { httpRequstService } from '../auth-services/http-request.service';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ScaningService {

    constructor(private _httpService : httpRequstService) { }


    public getScannigData(data:any): Observable<any>{
      return this._httpService.post(`scan-stamp-token`,data);
    }
 
}
