import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateStampComponent } from './generate-stamp.component';
import { StampListComponent } from './stamp-list/stamp-list.component';
import { AddEditStampComponent } from './add-edit-stamp/add-edit-stamp.component';
import { StampDetailsComponent } from './stamp-details/stamp-details.component';

const routes: Routes = [
  {
    path: '',
    component: GenerateStampComponent,
    children: [
      {
        path: 'stamp-list',
        component: StampListComponent
      },
      {
        path: 'add-edit-stamp',
        component: AddEditStampComponent
      },
      {
        path: 'stamp-details',
        component: StampDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateStampRoutingModule { }
