import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { SharedModule } from '../../shared/sharde.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerRenderComponent } from './render-component/customer-edit-view-button';
import { CustomerComponent } from './customer.component';
@NgModule({
  declarations: [
  CustomerListComponent,
  CustomerDetailsComponent,
  CustomerRenderComponent,
  CustomerComponent,  
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule
  ]
})
export class CustomerModule { }
