import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormRoutingModule } from './dynamic-form-routing.module';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';


@NgModule({
  declarations: [
    DynamicFormComponent
  ],
  imports: [
    CommonModule,
    DynamicFormRoutingModule
  ]
})
export class DynamicFormModule { }
