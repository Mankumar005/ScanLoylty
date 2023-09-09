import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScanAndDetailsComponent } from './scan-and-details/scan-and-details.component';

const routes: Routes = [
  {
    path:'',
    component:ScanAndDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScanRoutingModule { }
