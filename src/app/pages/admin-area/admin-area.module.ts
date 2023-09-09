import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAreaRoutingModule } from './admin-area-routing.module';
import { AdminAreaComponent } from './admin-area.component';
import { SharedModule } from '../../shared/sharde.module';
import { MasterModule } from './master/master.module';
import { UserManagementModule } from './user-management/user-management.module';
import { MarketingModule } from './marketing/marketing.module';

@NgModule({
  declarations: [
    AdminAreaComponent
  ],
  imports: [
    CommonModule,
    AdminAreaRoutingModule,
    MarketingModule,
    MasterModule,
    UserManagementModule,
    SharedModule
  ]
})
export class AdminAreaModule { }
