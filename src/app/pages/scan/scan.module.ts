import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScanRoutingModule } from './scan-routing.module';
import { ScanAndDetailsComponent } from './scan-and-details/scan-and-details.component';
import { SharedModule } from '../../shared/sharde.module';
import { ScanComponent } from './scan.component';


@NgModule({
  declarations: [
    ScanAndDetailsComponent,
    ScanComponent
  ],
  imports: [
    CommonModule,
    ScanRoutingModule,
    SharedModule
  ]
})
export class ScanModule { }
