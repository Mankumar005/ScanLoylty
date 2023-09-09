import { Injectable } from '@angular/core';
import { httpRequstService } from '../../auth-services/http-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private _httpService : httpRequstService) { }

  public addUpdateCompany(data: any): Observable<any> {
    return this._httpService.post(`companies/store-update`, data);
  }

  public getCompanyList(): Observable<any>{
    return this._httpService.get(`companies?`);
  }

  public getCompanyTypeList(): Observable<any>{
    return this._httpService.get(`company-type`);
  }

  public addFiles(data:any): Observable<any> {
    return this._httpService.post(`companybranchfiles`,data);
  }
  
  public getFilesListById(id: any): Observable<any> {
    return this._httpService.get(`company-branch-file?company_id=${id}`);
  }

  public getCompanyDetails(id: any): Observable<any> {
    return this._httpService.get(`companies/`+id);
  }

 
}
