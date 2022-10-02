import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  isExpanded: boolean = false;

  constructor(public router: Router,private apiRequest: RequestApiService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
   
  }

  logout() {
    this.apiRequest.logout()
      .subscribe((res:any) => {
        this.authenticationService.logout();
      }, (error:any) => {
        this.authenticationService.logout();
      })
  }

}
