import { NgModule } from '@angular/core';
import {
  NbAccordionModule,
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCalendarKitModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbCardModule,
  NbChatModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbPopoverModule,
  NbProgressBarModule,
  NbRadioModule,
  NbRouteTabsetModule,
  NbSelectModule,
  NbSpinnerModule,
  NbStepperModule,
  NbTabsetModule,
  NbToggleModule,
  NbTooltipModule,
  NbTreeGridModule,
  NbUserModule,
  NbWindowModule,
} from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesModule } from '../pages/pages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxEditorModule } from "ngx-editor";
import { InputTrimModule } from 'ng2-trim-directive';
import { UploadFileModalComponent } from './modal-service/upload-file-modal/upload-file-modal.component';
import { ConfirmModalComponent } from './modal-service/confirm-modal/confirm-modal.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgSelectModule } from '@ng-select/ng-select';

const MODULES = [
    ThemeModule,
    PagesModule,
    NbInputModule,
    NbTooltipModule,
    NbWindowModule,
    NbDialogModule,
    NbPopoverModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbIconModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    PagesModule,
    FormsModule,
    ReactiveFormsModule,
    NbAlertModule,
    NbTreeGridModule,
    Ng2SmartTableModule,
    CKEditorModule,
    NbRadioModule,
    NbDatepickerModule,
    NbSelectModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbListModule,
    NbAccordionModule,
    NgxEditorModule,
    NbCalendarModule,
    NbCalendarKitModule,
    NbCalendarRangeModule,
    NbChatModule,
    NbProgressBarModule,
    NbSpinnerModule,
    NbEvaIconsModule,
    NbToggleModule,
    InputTrimModule,
    NgSelectModule
];

const COMPONENTS = [
 
];

// const ENTRY_COMPONENTS = [
//   ShowcaseDialogComponent,
//   DialogNamePromptComponent,
//   WindowFormComponent,
//   NgxPopoverCardComponent,
//   NgxPopoverFormComponent,
//   NgxPopoverTabsComponent,
// ];

@NgModule({
  imports: [
    ...MODULES,
  ],
  declarations: [
    // ...COMPONENTS,
    UploadFileModalComponent,
    ConfirmModalComponent,
 
  ],
  exports : [
    ...MODULES,
  ]
})
export class SharedModule { }
