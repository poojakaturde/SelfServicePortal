import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LandingModule } from './modules/landing/landing.module';
import { MaterialModule } from './modules/Material/material.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppLoaderComponent } from './modules/loader/app-loader.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './core/interceptor/request-interceptor';
import { HttpClientModule } from '@angular/common/http';
import { RequestApiService } from './core/request-service/request-api.service';
import { SnackbarService } from './core/snack-bar/snackbar.service';
import { AuthenticationService } from './core/request-service/auth/authentication.service';
import { AuthguardService } from './core/request-service/auth-guard/authguard.service';
import { NgIdleModule } from '@ng-idle/core';

@NgModule({
  declarations: [
    AppComponent,
    AppLoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    LandingModule,
    MaterialModule,
    AuthModule,
    HttpClientModule,
    NgIdleModule.forRoot(),
  ],
  providers: [
    RequestApiService,
    SnackbarService,
    AuthenticationService,
    AuthguardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
