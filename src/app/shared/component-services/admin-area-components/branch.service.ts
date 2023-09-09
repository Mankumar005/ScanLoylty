import { Injectable } from '@angular/core';
import { httpRequstService } from '../../auth-services/http-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private _httpService : httpRequstService) { }

  public addUpdateBranch(data: any): Observable<any> {
    return this._httpService.post(`branches/store-update`, data);
  }

  public getCompanyList(): Observable<any> {
    return this._httpService.get(`companies?search&order_by=company_name&sort_by=ASC`);
  }

  public getBranchDetails(id: any): Observable<any> {
    return this._httpService.get(`branches/${id}`);
  }

  public getBranchList(company_id:any) {
    return this._httpService.get(`branches?search=&company_id=${company_id}&order_by=id&sort_by=DESC`);
  }
   
  public addFiles(data:any): Observable<any> {
    return this._httpService.post(`companybranchfiles`,data);
  }

  public getFilesListById(id:any): Observable<any> {
    return this._httpService.get(`company-branch-file?company_id=${id.company_id}&branch_id=${id.branch_id}`);
  }

  public onRemoveFilesById(id: any): Observable<any> {
    return this._httpService.delete(`companybranchfiles/${id}`);
  }
}
