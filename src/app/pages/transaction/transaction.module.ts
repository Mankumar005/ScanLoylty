import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { SharedModule } from '../../shared/sharde.module';
import { TransactionComponent } from './transaction.component';


@NgModule({
  declarations: [
    TransactionListComponent,
    TransactionComponent
  ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    SharedModule
  ]
})
export class TransactionModule { }
