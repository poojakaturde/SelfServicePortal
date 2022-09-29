import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MaterialModule } from '../Material/material.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    LandingComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MaterialModule
  ]
})
export class LandingModule { }
