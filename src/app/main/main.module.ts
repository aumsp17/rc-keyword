import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { ResearchersComponent } from './researchers/researchers.component';
import { KeywordsComponent } from './keywords/keywords.component';
import { MainComponent } from './main/main.component';
import { ResearcherDialogComponent } from './researcher-dialog/researcher-dialog.component';
import { ConfirmationSnackbarComponent } from './confirmation-snackbar/confirmation-snackbar.component';


@NgModule({
  declarations: [
    ResearchersComponent,
    KeywordsComponent,
    MainComponent,
    ResearcherDialogComponent,
    ConfirmationSnackbarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule
  ]
})
export class MainModule { }
