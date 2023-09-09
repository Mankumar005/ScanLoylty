import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpRequstService } from './http-request.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public base: string = 'auth/';

  constructor(private httpRequestService: httpRequstService) { }

  public loginUser(data:FormData){
    return this.httpRequestService.post(this.base + 'login', data);
  }

}
