
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpRequstService } from '../../auth-services/http-request.service';
 
@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

    constructor(private _httpService : httpRequstService) { }

    public getRoleList(): Observable<any> {
      return this._httpService.get(`roles?search=&order_by=id&sort_by=DESC`);
    }

    public getUserList(): Observable<any> {
        return this._httpService.get(`users?search=&company_id=&branch_id=&order_by=id&sort_by=DESC&is_active=1`);
    }

    public getUserById(id: any) {
        return this._httpService.get(`users/${id}`);
    }

    public saveUserRolesManagement(data: any) {
      return this._httpService.postWithFormData(`users/store-update`, data);
    }
  
    public onDeleteUser(id:any): Observable<any> {
        return this._httpService.delete(`users/${id}`);
      } 

}