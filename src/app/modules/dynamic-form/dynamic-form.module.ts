import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormRoutingModule } from './dynamic-form-routing.module';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { CreateEditDynamicFormComponent } from './create-edit-dynamic-form/create-edit-dynamic-form.component';
import { PreviewDynamicFormComponent } from './preview-dynamic-form/preview-dynamic-form.component';
import { MaterialModule } from '../Material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DynamicFormComponent,
    CreateEditDynamicFormComponent,
    PreviewDynamicFormComponent
  ],
  imports: [
    CommonModule,
    DynamicFormRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DynamicFormModule { }
