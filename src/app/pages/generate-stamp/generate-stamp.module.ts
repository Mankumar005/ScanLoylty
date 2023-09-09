import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateStampRoutingModule } from './generate-stamp-routing.module';
import { GenerateStampComponent } from './generate-stamp.component';
import { SharedModule } from '../../shared/sharde.module';
import { AddEditStampComponent } from './add-edit-stamp/add-edit-stamp.component';
import { StampListComponent } from './stamp-list/stamp-list.component';
import { StampDetailsComponent } from './stamp-details/stamp-details.component';
import { GenerateStempRenderComponent } from './render-component/customer-edit-view-button';


@NgModule({
  declarations: [
    GenerateStampComponent,
    AddEditStampComponent,
    StampListComponent,
    StampDetailsComponent,
    GenerateStempRenderComponent
  ],
  imports: [
    CommonModule,
    GenerateStampRoutingModule,
    SharedModule
  ]
})
export class GenerateStampModule { }
