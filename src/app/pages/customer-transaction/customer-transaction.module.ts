import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTransactionRoutingModule } from './customer-transaction-routing.module';
import { CustomerTransactionComponent } from './customer-transaction.component';
import { SharedModule } from '../../shared/sharde.module';
import { FindCustomerHistoryComponent } from './find-customer-history/find-customer-history.component';
import { CompanyRenderComponent } from './render-component/company-view-button';
import { BranchRenderComponent } from './render-component/branch-view-button';
import { CycleRenderComponent } from './render-component/cycle-view';

@NgModule({
  declarations: [
    CustomerTransactionComponent,
    FindCustomerHistoryComponent,
    CompanyRenderComponent,
    BranchRenderComponent,
    CycleRenderComponent
  ],
  imports: [
    CommonModule,
    CustomerTransactionRoutingModule,
    SharedModule
  ]
})
export class CustomerTransactionModule { }
