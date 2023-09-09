import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpRequstService } from '../../auth-services/http-request.service';
 
@Injectable({
  providedIn: 'root'
})
export class MenuService {

    constructor(private _httpService : httpRequstService) { }

    public getMenuData(obj: any): Observable<any> {
      return this._httpService.get(`menus?search=${(obj.search) ? obj.search : ''}&page_no=${obj.page_no}&per_page=${obj.per_page}&order_by=${obj.order_by}&sort_by=${obj.sort}&parent_id=0`);
    }

    public onSaveMenuData(data:any): Observable<any> {
      return this._httpService.post(`menus/store-update`,data);
    }

    public onDeleteMenu(menu_id:any): Observable<any> {
      return this._httpService.delete(`menus/${menu_id}`);
    }
}