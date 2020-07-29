import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';

import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  MatInputModule,
  MatExpansionModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
  MatBadgeModule,
  MatCardModule,
  MatTooltipModule
];

@NgModule({
  declarations: [],

  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
