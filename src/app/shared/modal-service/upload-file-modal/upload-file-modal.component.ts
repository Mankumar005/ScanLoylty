import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';
import { BranchService } from '../../component-services/admin-area-components/branch.service';
import { CommonService } from '../../common-service/common.service';
import { CompanyService } from '../../component-services/admin-area-components/company.service';
import { UtilService } from '../../common-service/util.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

imports: [
  ThemeModule,
]

@Component({
  selector: 'ngx-upload-file-modal',
  templateUrl: './upload-file-modal.component.html',
  styleUrls: ['./upload-file-modal.component.scss']
})
export class UploadFileModalComponent implements OnInit {

  @Input() branchData: any;
  @Input() isBranchMode: any;
  @Input() companyData: any;
  @Input() isCompanyMode: any;
  @Input() mode: any;

  public urls: any = [];
  public filesUrls: any = [];
  public url: any = [];
  public myFiles: any[] = [];

  public sMsg: any = '';
  public companyId: any = null;
  public branchId: any = null;
  public totalFileUpload: number = 0;

  constructor(protected ref: NbDialogRef<UploadFileModalComponent>,
    public branchService: BranchService,
    public companyService: CompanyService,
    public toastrService: NbToastrService,
    public commonSerivice: CommonService,
    private dialogService: NbDialogService,
    public utilService: UtilService) { }


  ngOnInit(): void {

    if (this.mode == 'addMode') {
      console.log('addMode');
      if (this.isCompanyMode) {
        // console.log(this.companyData,'this.companyData----');
        let getFiles = this.utilService.getLocalStorageValue('currentFile')
        if (getFiles) {
          this.urls = this.utilService.getLocalStorageValue('currentFile')
        }
      } else if (this.isBranchMode) {
        let getFiles = this.utilService.getLocalStorageValue('currentFile')
        if (getFiles) {
          this.urls = this.utilService.getLocalStorageValue('currentFile')
        }
      }

    }
    if (this.mode == 'editMode') {
      console.log('editMode');
      if (this.companyData) {
        this.companyId = this.companyData.id
        this.getCompanyFilelist()
      } else if (this.branchData) {
        this.companyId = this.branchData.company_id
        this.branchId = this.branchData.id
        this.getBranchFilelist()
      }
    }
  }


  public getCompanyFilelist() {
    this.companyService.getFilesListById(this.companyId).subscribe((res: any) => {
      this.filesUrls = res.data.getRecord
      // console.log(this.filesUrls,'this.fileList====');
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0]);
      }
    })
  }
  public getBranchFilelist() {
    let payloadObj: any = {};
    payloadObj.company_id = this.companyId
    payloadObj.branch_id = this.branchId
    this.branchService.getFilesListById(payloadObj).subscribe((res: any) => {
      this.filesUrls = res.data.getRecord
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0]);
      }
    })
  }
  public onSelectFile(event:any) {
    if(this.urls.length < 6){
      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.urls.push(event.target.result);
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
      for (var i = 0; i < event.target.files.length; i++) {
        this.myFiles.push(event.target.files[i]);
        this.url.push(event.target.files[i]);
        this.totalFileUpload = event.target.files[i].length
      }
      event.target.value = '';
    }else if(this.urls.length == 6){
      this.toastrService.warning('The file may not be greater than 6.','Warning');
    }
  }
  // addMode
  public upload() {
    this.utilService.storeLocalStorageValue('currentFile', this.urls)
    this.ref.close(this.myFiles);
  }
  //editMode
  public uploadFiles() {
    let payloadObj: any = {};
    payloadObj.company_id = this.companyId
    payloadObj.branch_id = this.branchId
    payloadObj['files[]'] = this.myFiles
    const fd: any = this.utilService.genrateFormData(payloadObj);
    this.commonSerivice.addFiles(fd).subscribe((res: any) => {
      this.toastrService.success(res.message, 'Success')
      this.ref.close(this.myFiles);
    })

  }

  public openConfirmModal(id: any, index: any) {
    let data: any = {};
    data.message = 'Are you sure want to delete file?'
    this.dialogService.open(ConfirmModalComponent, {
      context: {
        data: data
      },
      }).onClose.subscribe((confirm: any) => {
      if (confirm) {

      }
    });
  }
  public onRemoveFiles(id: any, index: any) {
    let data: any = {};
    data.message = 'Are you sure want to delete file?'
    this.dialogService.open(ConfirmModalComponent, {
      context: {
        data: data
      },
    })
      .onClose.subscribe((confirm: any) => {
        if (confirm) {
          this.filesUrls.splice(index, 1);
          console.log(this.filesUrls,'filesUrls=======');
          this.branchService.onRemoveFilesById(id).subscribe((res: any) => {
            this.toastrService.success(res.message, 'success')
          }, error => {
            if (error && error.error.errors && error.error.errors.failed) {
              this.toastrService.danger(error.error.errors.failed[0]);
            }
          })
        }
      });

  }
  public onRemoveCurrentFile(index: any,url:any) {
    let data: any = {};
    data.message = 'Are you sure want to delete file?'
    this.dialogService.open(ConfirmModalComponent, {
      context: {
        data: data
      },
    })
      .onClose.subscribe((confirm: any) => {
        if (confirm) {
          this.myFiles.splice(index, 1);
          this.urls.splice(index, 1);
          this.url.splice(index, 1);
          this.utilService.storeLocalStorageValue('currentFile', this.urls)
        }
      });
  }
  public cancel() {
    this.ref.close();
  }

}
