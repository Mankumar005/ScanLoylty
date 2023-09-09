import { Injectable } from '@angular/core';
import { httpRequstService } from '../../auth-services/http-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private _httpService : httpRequstService) { }

  public getBannerList() {
    return this._httpService.get(`branches?`);
  }

  public addUpdateBannerData(data: any): Observable<any> {
    return this._httpService.post(`branches/store-update`, data);
  }

  public getBannerDetails(id: any): Observable<any> {
    return this._httpService.get(`branches/${id}`);
  }

  public deleteBanner(id: any): Observable<any> {
    return this._httpService.get(`branches/${id}`);
  }
 
}
