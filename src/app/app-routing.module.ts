import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { SignupComponent } from './modules/auth/signup/signup.component';
import { HomeComponent } from './modules/landing/home/home.component';
import { LandingComponent } from './modules/landing/landing/landing.component';
import { SidebarComponent } from './modules/landing/sidebar/sidebar.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: "home",
    component: LandingComponent,
    children: [
      {
        path: "",
        component: HomeComponent
      },
      {
        path: "dynamic-form",
        loadChildren: () => import('./modules/dynamic-form/dynamic-form.module').then(m => m.DynamicFormModule)
      },
      {
        path: "application",
        loadChildren: () => import('./modules/application/application.module').then(m => m.ApplicationModule)
      },
    ]
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
