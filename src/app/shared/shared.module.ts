import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule
  ],
  exports: [
    ReactiveFormsModule,
    FlexLayoutModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule
  ]
})
export class SharedModule { }
