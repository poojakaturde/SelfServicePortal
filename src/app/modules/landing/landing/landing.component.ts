import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { environment } from 'src/environments/environment';
import { LogoutWarningDialogComponent } from '../logout-warning-dialog/logout-warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

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
  navigationOptions: any = [];

  dialogRef: any = null;
  showDialog: boolean = true;

  idleEnd: any = null;
  idleTimeOut: any = null;
  onIdleStart: any = null;

  constructor(public router: Router, private apiRequest: RequestApiService,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog, private idle: Idle,
    private changeDetector: ChangeDetectorRef) {

    this.idle.setIdle(1);
    this.idle.setTimeout(1);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe((res) => {
      console.log(res)
      this.reset();
    })

    this.idleTimeOut = this.idle.onTimeout.subscribe(() => {
      this.logout();
    });

    this.idle.onIdleStart.subscribe(() => {
      console.log("idle start")
      this.openDialog();
    });

  }

  ngOnInit(): void {
    this.navigationOptions = this.authenticationService.getNavigationOptions();
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

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  reset() {
    this.showDialog = true;
    if (this.dialogRef && this.dialog.openDialogs.length) {
      this.dialogRef.close();
    }
  }

  openDialog() {
    if (this.showDialog) {
      this.dialogRef = this.dialog.open(LogoutWarningDialogComponent, { disableClose: true, width: '400px' });

      this.dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.logout();
        } else {
          this.reset();
        }
      });
    }
    this.showDialog = false;
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
