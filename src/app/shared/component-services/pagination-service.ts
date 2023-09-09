import { Injectable } from '@angular/core';
import { httpRequstService } from '../auth-services/http-request.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
 
@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(private _httpService : httpRequstService,
              private http : HttpClient) { }
 
  getBranchData(pageNumber: number, pageSize: number): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json','Accept': 'application/json' ,'X-Pagination':'X-Pagination'});
    let params = new HttpParams();
    params = params.append('page_no',pageNumber.toString());
    params = params.append('per_page',pageSize.toString());
    // params = params.append('search','joan');
    return this.http.get<any[]>('branches?company_id=2&order_by=branch_name&sort_by=ASC', {headers: headers, observe: "response" as "body",  responseType: "json", params} );
  }
}
