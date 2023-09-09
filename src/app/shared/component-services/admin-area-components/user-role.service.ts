
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpRequstService } from '../../auth-services/http-request.service';
 
@Injectable({
  providedIn: 'root'
})
export class UserRolesService {

    constructor(private _httpService : httpRequstService) { }

    public getUserRoleData(): Observable<any> {
      return this._httpService.get(`roles?search=&order_by=id&sort_by=DESC`);
    }

    public onDeleteUser(id:any): Observable<any> {
      return this._httpService.get(`users/${id}`);
    } 

    public getAllPermission(params: any) {
      return this._httpService.get(`permissions?`,params);
    }
  
    public getAllMenus(data?: any) {
      return this._httpService.get(`menus?`, data);
    }
  
    public saveRole(data: any) {
      return this._httpService.postWithFormData(`users/store-update`, data);
    }
  
    public getRoleById(id: any) {
      return this._httpService.get(`roles/${id}`);
    }

    public getRegistrationRolesDetail(id: any) {
      return this._httpService.get(`roles/${id}`);
    }
  
    public manageRegistrationRoles(data: any) {
      return this._httpService.post(`roles/store-update`, data);
    }

    public getUserRoleList(): Observable<any> {
      return this._httpService.get(`roles?search=&order_by=role_id&sort_by=DESC`);
    }

    public onDeleteUserRole(id:any): Observable<any> {
      return this._httpService.delete(`roles/${id}`);
    } 
}