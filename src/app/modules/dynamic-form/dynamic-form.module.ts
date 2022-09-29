import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormRoutingModule } from './dynamic-form-routing.module';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { CreateEditDynamicFormComponent } from './create-edit-dynamic-form/create-edit-dynamic-form.component';
import { PreviewDynamicFormComponent } from './preview-dynamic-form/preview-dynamic-form.component';


@NgModule({
  declarations: [
    DynamicFormComponent,
    CreateEditDynamicFormComponent,
    PreviewDynamicFormComponent
  ],
  imports: [
    CommonModule,
    DynamicFormRoutingModule
  ]
})
export class DynamicFormModule { }
