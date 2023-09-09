import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilService } from '../../../../../shared/common-service/util.service';
import { CommonService } from '../../../../../shared/common-service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { CompanyService } from '../../../../../shared/component-services/admin-area-components/company.service';
import { UploadFileModalComponent } from '../../../../../shared/modal-service/upload-file-modal/upload-file-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-add-edit-company',
  templateUrl: './add-edit-company.component.html',
  styleUrls: ['./add-edit-company.component.scss']
})
export class AddEditCompanyComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  @ViewChild('fileBrowser') public fileBrowser: any;

  public companyTypeList: Array<any> = [];
  public companyList: Array<any> = [];
  public countryList: Array<any> = [];
  public stateList: Array<any> = [];
  public cityList: Array<any> = [];
  public companyData: Array<any> = [];
  public uploadfiles: Array<any> = [];
  public getFiles: any[] = [];

  public extraa: any = null;
  public fileList: any = null;
  public formData: any;
  public fileToUploadName: any = '';

  public imageName: string = '';
  public fileUrl: string = '';

  public isWrongResumeUpload: boolean = false;
  public isFileFound: boolean = false;
  public isLoading: boolean = false;
  public isTextEditior: boolean = false;
  public showpassword: boolean = false;
  public is_add: boolean = false;
  public companyId: any = null;
  public regexGstvalid = '^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$'


  public formValidations: any = {
    company_id: [{ type: 'required', message: ' Company Name is required' }],
    company_name: [{ type: 'required', message: ' Company Name is required' }],
    contact_person_name: [{ type: 'required', message: 'Person Name is required' }],
    company_type_id: [{ type: 'required', message: 'Company Type is required' },],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter valid email' },
    ],
    country_code: [{ type: 'required', message: 'Country Code is required' }],
    contact_country_code: [{ type: 'required', message: 'Contact Country Code is required' }],
    phone: [{ type: 'required', message: 'Phone is required' }],
    contact_phone: [{ type: 'required', message: 'Person Phone is required' }],
    //  password:[{ type: 'required', message: 'Password is required' },],
    company_address: [{ type: 'required', message: 'Company Address is required' }],
    zip_code: [{ type: 'required', message: 'Zip Code is required' },],
    company_gst_no: [
      { type: 'required', message: 'Company GST no is required' },
      { type: 'pattern', message: 'Enter valid GST Number' },
    ],
    country_id: [{ type: 'required', message: 'Country is required' },],
    state_id: [{ type: 'required', message: 'State is required' },],
    city_id: [{ type: 'required', message: 'City is required' },],

  }

  addEditCompanyForm = this.fb.group({
    company_id: new FormControl(''),
    company_type_id: new FormControl(''),
    country_code: new FormControl('+91'),
    contact_country_code: new FormControl('+91'),
    company_name: new FormControl(''),
    phone: new FormControl('', [Validators.compose([Validators.required, Validators.minLength(10)])]),
    email: new FormControl('', [Validators.pattern(this.utilService._emialRegExp)]),
    company_address: new FormControl(''),
    company_gst_no: new FormControl('',[Validators.pattern(this.regexGstvalid)]),
    zip_code: new FormControl(''),
    country_id: new FormControl(''),
    state_id: new FormControl(''),
    city_id: new FormControl(''),
    files: new FormControl(''),
  })
  personDetailsForm = this.fb.group({
    contact_person_name: new FormControl(''),
    contact_phone: new FormControl('', [Validators.compose([Validators.required, Validators.minLength(10)])]),
  });

  constructor(public utilService: UtilService,
    public fb: FormBuilder,
    public companyService: CompanyService,
    public commonService: CommonService,
    public router: Router,
    public route: ActivatedRoute,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.companyId = atob(params.company_id);
      this.is_add = params.is_add
      if (this.companyId) {
        this.getCompanyDetalis(this.companyId)
      }
    })
  }
  ngOnInit(): void {
    this.getCompanyTypelist()
    this.getCompanylist();
    this.getCountrylist();
    this.getStatelist();
    this.getCitylist();
    localStorage.removeItem('currentFile')
    this.getFiles = this.utilService.getLocalStorageValue('currentFile')
    if (this.getFiles.length) {
      this.isFileFound = true;
    }
    if (this.companyId) {
      this.getFilelist()
    }
  }

  public getCountrylist() {
    this.subscription.push(this.commonService.getCountryList().subscribe((res: any) => {
      this.countryList = res.data
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public getStatelist() {
    this.subscription.push(this.commonService.getStateList('').subscribe((res: any) => {
      this.stateList = res.data
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public getCitylist() {
    this.subscription.push(this.commonService.getCityList('').subscribe((res: any) => {
      this.cityList = res.data
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }

  public getCompanyTypelist() {
    this.subscription.push(this.companyService.getCompanyTypeList().subscribe((res: any) => {
      this.companyTypeList = res.data
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public getCompanylist() {
    this.subscription.push(this.companyService.getCompanyList().subscribe((res: any) => {
      this.companyList = res.data
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public getFilelist() {
    this.subscription.push(this.companyService.getFilesListById(this.companyId).subscribe((res: any) => {
      this.fileList = res.data.total_rows
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public getCompanyDetalis(company_id:any) {
    this.subscription.push(this.companyService.getCompanyDetails(company_id).subscribe((res: any) => {
      this.companyData = res.data
      if (this.companyId) {
        this.addEditCompanyForm.patchValue(res.data) //isEditMode PatchValue /
        this.personDetailsForm.patchValue(res.data) //isEditMode PatchValue /
        if (res.data.files) {
          this.fileUrl = res.data.files.length
        }
      }
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }

  public isHideShow() {
    this.showpassword = !this.showpassword
  }

  public next(details: any) {
    if (details == 'company_details') {
      this.addEditCompanyForm.markAllAsTouched();
      if (this.addEditCompanyForm.invalid) {
        return;
      }
    }
    if (details == 'person_details') {
      this.personDetailsForm.markAllAsTouched();
      if (this.personDetailsForm.invalid) {
        return;
      }

      let mergeFormObj: any = {};
      mergeFormObj = Object.assign(this.addEditCompanyForm.value, this.personDetailsForm.value)
      this.utilService.storeLocalStorageValue('formData', mergeFormObj)
      this.formData = this.utilService.getLocalStorageValue('formData')
      if (this.formData) {
        this.companyTypeList.filter((el: any) => {
          if (el.id == this.formData.company_type_id) {
            this.formData.compant_Type = el.company_type_name
          }
        })
        this.countryList.filter((el: any) => {
          if (el.id == this.formData.country_id) {
            this.formData.country_Name = el.country_name
          }
        })
        this.stateList.filter((el: any) => {
          if (el.id == this.formData.state_id) {
            this.formData.state_Name = el.state_name
          }
        })
        this.cityList.filter((el: any) => {
          if (el.id == this.formData.city_id) {
            this.formData.city_Name = el.city_name
          }
        })
      }
    }
  }

  public onSubmit() {
    this.isLoading = true;
    this.addEditCompanyForm.markAllAsTouched();
    if (this.addEditCompanyForm.invalid) {
      this.isLoading = false;
      // return;
    }
    let payloadObj: any = {}
    payloadObj = Object.assign(this.addEditCompanyForm.value, this.personDetailsForm.value)
    payloadObj['files[]'] = this.uploadfiles
    //  payloadObj.password = this.utilService.convertStringBase64(this.addEditCompanyForm.value.password) 
    if (this.companyId) {
      payloadObj.company_id = this.companyId;
      payloadObj.password = "";
    }
    delete payloadObj.files
    //  console.log(payloadObj,'payloadObj-----');
    const fd: any = this.utilService.genrateFormData(payloadObj);
    this.subscription.push(this.companyService.addUpdateCompany(fd).subscribe((res: any) => {
      this.isLoading = false;
      this.toastrService.success(res.message, 'Success')
      this.router.navigateByUrl('/pages/admin-area/master/company-list')
      localStorage.removeItem('fromData')
      localStorage.removeItem('currentFile')
    }, (error) => {
      this.isLoading = false;
      if (error && error.error.errors) {
        this.toastrService.danger(error.error.message, 'Error')
      }
    }))
  }


  public openUploadFileModal(modeType: any) {
    this.dialogService.open(UploadFileModalComponent, {
      context: {
        mode: modeType,
        isCompanyMode: true,
        companyData: this.companyData
      },
    })
      .onClose.subscribe((files: any) => {
        this.uploadfiles = files;
        this.getFiles = this.utilService.getLocalStorageValue('currentFile')
        if (this.companyId) {
          this.getFilelist()
        }
        if (this.getFiles.length) {
          this.isFileFound = true;
        } else {
          this.isFileFound = false;
        }
      });
  }

  public back() {
    this.router.navigateByUrl('/pages/admin-area/master/company-list')
  }
  public ngOnDestroy(): void {
    localStorage.removeItem('formData')
    localStorage.removeItem('currentFile')
    localStorage.removeItem('companyObj');
    console.log('levers company');
    
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }

}
