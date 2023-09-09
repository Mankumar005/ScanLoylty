import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { ScaningService } from '../../../shared/component-services/scan.service';
import { UtilService } from '../../../shared/common-service/util.service';
import { NbToastrService } from '@nebular/theme';
import { Subscription } from 'rxjs';
@Component({
  selector: 'ngx-scan-and-details',
  templateUrl: './scan-and-details.component.html',
  styleUrls: ['./scan-and-details.component.scss']
})
export class ScanAndDetailsComponent implements  OnDestroy {
  public subscription: Subscription[] = [];
  public createdCode: any;
  //scan end //
  public scannigData: Array<any> = [];
  public isLoading: boolean = false;
  public isTokenSuccess: boolean = false;
  public source: LocalDataSource = new LocalDataSource();
  public pageSize: number = 10;
  public currentPage: number = 1;
  public showPerPage: number = 9;
  public totalCount: any;
  public onPermission : any = {
    access : false,
    create  :  false,
    update : false,
    view : false,
    delete : false,
  }

  settings = {
    mode: 'external',
    pager: {
      display: true,
      perPage: this.showPerPage,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    actions: {
      add: false,
      delete: false,
      edit: false,
      index: false,
    },
    columns: {
      index: {
        title: 'No',
        type: 'string',
        filter: false,
        sort: false,
        valuePrepareFunction: (val, row, cell) => {
          const pager = this.source.getPaging();
          const ret = (pager.page - 1) * pager.perPage + cell.row.index + 1;
          return ret;
        }
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      phone: {
        title: 'Phone',
        type: 'string',
      },
      customer_cycle_id: {
        title: 'Cycle No',
        type: 'string',
      },
      sequence_no: {
        title: 'Sequence No',
        type: 'number',
        filter: false,
        sort: false,
      },
      stamp_scan_token: {
        title: 'Token',
        type: 'string',
      },
      offer_description: {
        title: 'Offer',
        type: 'number',
        filter: false,
        sort: false,
      },
      utilized_date_time: {
        title: 'Use Date',
        type: 'number',
        filter: false,
        sort: false,
      }

    },
  };

  public formValidations: any = {
    stamp_token: [{ type: 'required', message: 'QR Code is required' }],
    billing_amount: [{ type: 'required', message: 'Bill Amount is required' }],
    billing_description: [{ type: 'required', message: 'Bill Description is required' }],

  }
  scanAndDetailsForm = this.fb.group({
    stamp_token: new FormControl(''),
    billing_amount: new FormControl(''),
    billing_description: new FormControl(''),
  })

  constructor(public fb: FormBuilder,
    public scannigService: ScaningService,
    public utilService: UtilService,
    private toastrService: NbToastrService,
  ) { 
 
    }


  public onSubmit() {
    this.isLoading = true;
    this.scanAndDetailsForm.markAllAsTouched();
    if (this.scanAndDetailsForm.invalid) {
      this.isLoading = false;
      // return;
    }
    let payloadObj: any = {};
    payloadObj = this.scanAndDetailsForm.value
    console.log(payloadObj, 'payloadObj-----');
    if (payloadObj) {
      this.getScaningDetails(payloadObj)
    }
  }

  public getScaningDetails(payloadObj) {
    const fd: any = this.utilService.genrateFormData(payloadObj);
    this.subscription.push(this.scannigService.getScannigData(fd).subscribe((res: any) => {
      this.isLoading = false;
      this.isTokenSuccess = true;
      this.scannigData = res.data;
      this.scannigData.forEach((el: any) => {
        el.name = el.customer?.name
        el.phone = el.customer?.phone
      })
      this.source.load(this.scannigData);
      this.toastrService.success(res.message, 'Success')
      this.scanAndDetailsForm.reset()
      setTimeout(() => {
        this.isTokenSuccess = false;
      }, 3000);
    }, error => {
      this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public newScan() {
    this.scanAndDetailsForm.reset();
    this.scannigData = [];
    this.source.load([]);
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
