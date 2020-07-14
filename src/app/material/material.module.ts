import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';

import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

const MaterialComponents = [CommonModule,
  BrowserAnimationsModule,
  MatButtonModule,
  MatIconModule,
  MatDividerModule,
  MatSidenavModule,
  LayoutModule,
  MatToolbarModule,
  MatListModule,
  MatDialogModule,
  FormsModule,
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule
];

@NgModule({
  declarations: [],

  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
