
 import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from '../../shared/common-service/util.service';
import { AuthService } from '../../shared/auth-services/auth.service';
import { PasswordStrengthValidator } from '../../shared/custom-validator.service.ts/password.validator';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  protected service: NbAuthService;
  protected options: {};
  protected cd: ChangeDetectorRef;
  // protected router: Router;
  redirectDelay: number;
  showMessages: any;
  strategy: string;
  errorsMessage: string = '' ;
  successMessages: string = '';
  user: any;
  submitted: boolean;
  rememberMe: boolean;
 
  public  loginForm!: FormGroup;

  public isLoading : boolean= false;
  public  hide : boolean = true;
  public isLogedIn : boolean = false;
  public showPassword: boolean = false;


  public formValidations: any = {
    email: [
      { type: "required", message: "Email is required" },
      { type: "pattern", message: "Enter valid email" },
    ],
    password: [
      { type: "required", message: "Password is required" },
    ],
  };

  constructor(
    public fb: FormBuilder,
    public utilService: UtilService,
    public authService: AuthService,
    public router : Router,
    private toastrService: NbToastrService,
    ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,Validators.pattern(this.utilService._emialRegExp)]],
      password: ['',[Validators.required]],
  });
  }


public isHideShow(){
    this.showPassword = !this.showPassword 
  }


public onSubmit() {
    this.isLoading = true
    this.loginForm.updateValueAndValidity();
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      this.isLoading = false;
      return;
    }
    let basicDetailForm = this.loginForm.value
      basicDetailForm.password = this.utilService.convertStringBase64(basicDetailForm.password);
      this.authService.loginUser(basicDetailForm).subscribe((res: any) => {   
        this.isLoading = false;
        this.toastrService.success(res.message,'Success')
        this.utilService.storeLocalStorageValue('userDetail',res.data);
        this.utilService.storeLocalStorageValue('access_token',res.access_token,false);
        setTimeout(() => {
        this.router.navigateByUrl('/pages/dashboard');
        }, 500);
      }, error => {
        this.isLoading = false;
        this.isLogedIn = true;
        if(error && error.error.errors && error.error.errors.failed) {
          // this.utilService.showError(error.error.errors.failed[0]);
          this.toastrService.danger(error.error.errors.failed[0],'Error')
        }
        if(error && error.error.errors && error.error.errors.password) {
          // this.utilService.showError(error.error.errors.password[0]);
          this.toastrService.danger(error.error.errors.password[0],'Error')

        }
        setTimeout(() => {
          this.isLogedIn = false;
        },3000);
      });
  }
}
