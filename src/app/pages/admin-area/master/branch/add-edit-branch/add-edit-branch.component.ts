import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UtilService } from '../../../../../shared/common-service/util.service';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BranchService } from '../../../../../shared/component-services/admin-area-components/branch.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { PasswordStrengthValidator } from '../../../../../shared/custom-validator.service.ts/password.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../../shared/common-service/common.service';
import { UploadFileModalComponent } from '../../../../../shared/modal-service/upload-file-modal/upload-file-modal.component';
import { Editor, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs';
@Component({
  selector: 'ngx-add-edit-branch',
  templateUrl: './add-edit-branch.component.html',
  styleUrls: ['./add-edit-branch.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddEditBranchComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  @ViewChild('fileBrowser') public fileBrowser: any;

  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  get doc(): AbstractControl {
    return this.addEditBranchForm.get('editorContent');
  }

  public companyList: Array<any> = [];
  public countryList: Array<any> = [];
  public stateList: Array<any> = [];
  public cityList: Array<any> = [];
  public uploadfiles: Array<any> = [];
  public fileList: Array<any> = [];
  public getFiles: any[] = [];
  public branchData: any;

  public extraa: any = null;
  public fileToUploadName: any = '';
  public formData: any;
  public text_editer_value: any;

  public fileUrl: any = '';
  public textEditorValue: any = '';
  public regexGstvalid = '^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$'

  public isWrongResumeUpload: boolean = false;
  public isFileFound: boolean = false;
  public isLoading: boolean = false;
  public isTextEditior: boolean = false;
  public showPassword: boolean = false;
  public is_add: boolean = false;

  public branchId: any = null;
  public companyId: any = null;

  public formValidations: any = {
    company_id: [{ type: 'required', message: ' Company Name is required' }],
    contact_person_name: [{ type: 'required', message: ' Name is required' }],
    branch_name: [{ type: 'required', message: 'Branch Name is required' },],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter valid email' },
    ],
    country_code: [{ type: 'required', message: 'Country Code is required' }],
    phone: [{ type: 'required', message: 'Branch Phone is required' }],
    contact_phone: [{ type: 'required', message: 'Person Phone is required' }],
    password: [{ type: 'required', message: 'Password is required' },],
    branch_address: [{ type: 'required', message: 'Branch Address is required' }],
    zip_code: [{ type: 'required', message: 'Zip Code is required' },],
    branch_gst_no: [
      { type: 'required', message: 'Branch GST no is required' },
      { type: 'pattern', message: 'Enter valid GST Number' },
    ],
    country_id: [{ type: 'required', message: 'Country is required' },],
    state_id: [{ type: 'required', message: 'State is required' },],
    city_id: [{ type: 'required', message: 'City is required' },],
    working_hours: [{ type: 'required', message: 'Working Hours is required' },],
    terms_and_condition: [{ type: 'required', message: 'Terms And Condition is required' },],

  }

  addEditBranchForm = this.fb.group({
    branch_id: new FormControl(''),
    country_code: new FormControl('+91'),
    company_id: new FormControl(''),
    branch_name: new FormControl(''),
    phone: new FormControl('', [Validators.compose([Validators.required, Validators.minLength(10)])]),
    email: new FormControl('', [Validators.pattern(this.utilService._emialRegExp)]),
    password: new FormControl('', [PasswordStrengthValidator]),
    branch_address: new FormControl(''),
    zip_code: new FormControl(''),
    branch_gst_no: new FormControl('', [Validators.pattern(this.regexGstvalid)]),
    country_id: new FormControl(''),
    state_id: new FormControl(''),
    city_id: new FormControl(''),
    working_hours: new FormControl(''),
    terms_and_condition: new FormControl(''),
    is_required: new FormControl(''),
    files: new FormControl(''),
  })
  personDetailsForm = this.fb.group({
    email: new FormControl(''),
    contact_person_name: new FormControl(''),
    contact_phone: new FormControl('', [Validators.compose([Validators.required, Validators.minLength(10)])]),
  });

  setPasswrodForm = this.fb.group({
    email: new FormControl('', [Validators.pattern(this.utilService._emialRegExp)]),
    password: new FormControl('', [PasswordStrengthValidator]),
  });

  constructor(public utilService: UtilService,
    public fb: FormBuilder,
    public branchService: BranchService,
    public commonService: CommonService,
    public router: Router,
    public route: ActivatedRoute,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService

  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.branchId = atob(params.branch_id);
      this.is_add = params.is_add;
      if (this.branchId) {
        this.getBranchDetalis(this.branchId)
      }
    })
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.addEditBranchForm.get('terms_and_condition').valueChanges.subscribe((value:any)=>{
      if(!value || value == '<p></p>'){
        this.addEditBranchForm.get('is_required')?.setValidators([Validators.required])
        this.addEditBranchForm.get('is_required')?.updateValueAndValidity()
        this.isTextEditior = true;
      }else{ 
        this.addEditBranchForm.get('is_required')?.clearValidators();
        this.addEditBranchForm.get('is_required')?.updateValueAndValidity()
        this.isTextEditior = false;
      }
    })
    // this.addEditBranchForm.get('terms_and_condition').setValue('okkkkk')
    this.getCompanylist();
    this.getCountrylist();
    this.getStatelist();
    this.getCitylist();
    localStorage.removeItem('currentFile')
    this.getFiles = this.utilService.getLocalStorageValue('currentFile')
    if (this.getFiles.length) {
      this.isFileFound = true;
    }
    if (this.branchId) {
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

  public getCompanylist() {
    this.subscription.push(this.branchService.getCompanyList().subscribe((res: any) => {
      this.companyList = res.data
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }

  public getFilelist() {
    let payloadObj: any = {};
    payloadObj.company_id = this.companyId
    payloadObj.branch_id = this.branchId
    this.subscription.push(this.branchService.getFilesListById(payloadObj).subscribe((res: any) => {
      this.fileList = res.data.total_rows
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }

  public getBranchDetalis(branch_id) {
    this.subscription.push(this.branchService.getBranchDetails(branch_id).subscribe((res: any) => {
      this.branchData = res.data
      this.companyId = this.branchData.company_id
      this.getFilelist()
      if (this.branchId) {
        this.addEditBranchForm.patchValue(res.data) //isEditMode PatchValue /
        this.personDetailsForm.patchValue(res.data)
        // this.termsAndconditionForm.patchValue(res.data)
        this.setPasswrodForm.patchValue(res.data)
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
    this.showPassword = !this.showPassword
  }

  public next(details: any) {
    if (details == 'company_details') {
      this.text_editer_value = this.addEditBranchForm.get('terms_and_condition').value;
      this.addEditBranchForm.markAllAsTouched();
      if (this.addEditBranchForm.invalid) {
        return;
      }
    }
    if (details == 'person_details') {
      this.personDetailsForm.markAllAsTouched();
      if (this.personDetailsForm.invalid) {
        return;
      }
      let mergeFormObj: any = {};
      mergeFormObj = Object.assign(this.addEditBranchForm.value, this.personDetailsForm.value,
        this.setPasswrodForm.value)
      mergeFormObj.terms_and_condition = this.text_editer_value
      this.utilService.storeLocalStorageValue('formData', mergeFormObj)
      this.formData = this.utilService.getLocalStorageValue('formData')
      let terms = this.utilService.getLocalStorageValue('terms_and_condition')

      if (this.formData) {
        this.companyList.filter((el: any) => {
          if (el.id == this.formData.company_id) {
            this.formData.company_Name = el.company_name
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

    if (details == 'set_password') {
      this.setPasswrodForm.markAllAsTouched();
      if (this.setPasswrodForm.invalid) {
        return;
      }

      let mergeFormObj: any = {};
      mergeFormObj = Object.assign(this.addEditBranchForm.value, this.personDetailsForm.value,
        this.setPasswrodForm.value)
      this.utilService.storeLocalStorageValue('formData', mergeFormObj)
      this.formData = this.utilService.getLocalStorageValue('formData')
      if (this.formData) {
        this.companyList.filter((el: any) => {
          if (el.id == this.formData.company_id) {
            this.formData.company_Name = el.company_name
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
    this.addEditBranchForm.markAllAsTouched();
    if (this.addEditBranchForm.invalid) {
      this.isLoading = false;
      // return;
    }
    let payloadObj: any = {}
    payloadObj = Object.assign(this.addEditBranchForm.value, this.personDetailsForm.value,
      this.setPasswrodForm.value)
    payloadObj.password = this.utilService.convertStringBase64(this.addEditBranchForm.value.password)
    if (this.branchId) {
      payloadObj.branch_id = this.branchId
    }
    payloadObj['files[]'] = this.uploadfiles
    delete payloadObj.files
    // console.log(payloadObj,'payloadObj-----');
    const fd: any = this.utilService.genrateFormData(payloadObj);
    this.subscription.push(this.branchService.addUpdateBranch(fd).subscribe((res: any) => {
      this.isLoading = false;
      this.toastrService.success(res.message, 'Success')
      this.router.navigateByUrl('/pages/admin-area/master/branch-list')
      localStorage.removeItem('formData')
      localStorage.removeItem('currentFile')
    }, (error) => {
      this.isLoading = false;
      if (error && error.error.errors) {
        this.toastrService.danger(error.error.message, 'Error')
      }
      this.toastrService.danger(error.errors.terms_and_condition[0].message, 'Error')
    }))

  }
  public openUploadFileModal(modeType: any) {
    this.dialogService.open(UploadFileModalComponent, {
      context: {
        mode: modeType,
        isBranchMode: true,
        branchData: this.branchData
      },
    }).onClose.subscribe((files: any) => {
      this.uploadfiles = files;
      this.getFiles = this.utilService.getLocalStorageValue('currentFile')
      if (this.branchId) {
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
    this.router.navigateByUrl('/pages/admin-area/master/branch-list')
  }
  public ngOnDestroy(): void {
    localStorage.removeItem('formData');
    localStorage.removeItem('currentFile');
    localStorage.removeItem('companyObj');
    this.editor.destroy();
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
