import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerTransactionComponent } from './customer-transaction.component';
import { FindCustomerHistoryComponent } from './find-customer-history/find-customer-history.component';

const routes: Routes = [
  {
    path: '',
    component: FindCustomerHistoryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerTransactionRoutingModule { }
