import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { environment } from 'src/environments/environment';
import { LogoutWarningDialogComponent } from '../logout-warning-dialog/logout-warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

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

  idleEnd: any = null;
  idleTimeOut: any = null;
  onIdleStart: any = null;

  constructor(public router: Router, private apiRequest: RequestApiService,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog) {
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
