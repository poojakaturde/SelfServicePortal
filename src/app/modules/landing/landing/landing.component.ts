import { Component, OnInit} from '@angular/core';
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
  photoUrl: any;
  userInfo: string = '';
  userMail: any;
  userId: any;
  userInfoSubscription: any = null;

  constructor(public router: Router, private apiRequest: RequestApiService,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.userInfoSubscription = this.authenticationService.userInfoOb$
      .subscribe((userData: any) => {
        if (userData && userData.userName) {
          this.userInfo = userData.name;
          this.userMail = userData.userName;
          this.userId = userData.userId;
          this.photoUrl = userData.photo;
        }
      });
  }

  logout() {
    this.apiRequest.logout()
      .subscribe((res: any) => {
        this.authenticationService.logout();
      }, (error: any) => {
        this.authenticationService.logout();
      })
  }
}
