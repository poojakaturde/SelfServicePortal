import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { environment } from 'src/environments/environment';
import { LogoutWarningDialogComponent } from '../logout-warning-dialog/logout-warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  isExpanded: boolean = false;
  photoUrl: any;
  dialogPhotoUrl: any;
  userInfo: string = '';
  userMail: any;
  userId: any;
  userInfoSubscription: any = null;
  navigationOptions: any = [];
  file: any;
  dialogRef: any = null;
  showDialog: boolean = true;

  idleEnd: any = null;
  idleTimeOut: any = null;
  onIdleStart: any = null;

  constructor(public router: Router, private apiRequest: RequestApiService,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog, private idle: Idle,
    private snackbar: SnackbarService,
    private changeDetector: ChangeDetectorRef) {

    this.idle.setIdle(environment.userSessionIdleTime);
    this.idle.setTimeout(environment.userSessionTimeOut);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.watch();

    this.idleEnd = this.idle.onIdleEnd.subscribe(() => {
      this.reset();
    });

    this.idleTimeOut = this.idle.onTimeout.subscribe(() => {
      this.logout();
    });

    this.onIdleStart = this.idle.onIdleStart.subscribe(() => {
      this.openDialog();
    });

    this.reset();
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

  editProfilePageModel() {
    
  }

  closeDialog(id: any) {
    const ele: HTMLElement = document.getElementById(id) as HTMLElement;
    ele.click();
  }

  onSelectFile(event: any) {
    // this.file = event.target.files[0];
    // this.imgType = this.file.type.match('\.(png|jpg|jpeg)$');
    // this.fileSize = event.target.files[0].size;
    // this.loading = !this.loading;
    // let reader = new FileReader();
    // reader.onload = () => {
    //   if (this.imgType == null) {    //(/image\/*/)
    //     this.snackbar.open('Please upload an image in PNG or JPEG format.', '', { type: 'warning', duration: 5000 });
    //     this.dialogPhotoUrl = null;
    //     this.file = null;
    //     return;
    //   }
    // }
  }

  uploadProfilePicture() {

    // this.apiRequest.uploadProfilePicture(this.userId, this.file)
    //   .subscribe((resp: any) => {
    //     if (resp && resp.status === 'S') {
    //       let userInfo = JSON.parse(localStorage.getItem('__UI'));
    //       this.photoUrl = this.dialogPhotoUrl;
    //       userInfo.photo = this.dialogPhotoUrl;
    //       localStorage.setItem('__UI', JSON.stringify(userInfo));
    //       this.closeDialog('profiles-close-modal');
    //     }
    //     if (resp && resp.status === 'E' && resp.description) {
    //       this.snackbar.open(resp.description, '', { type: 'warning' });
    //     }
    //   }, (err: any) => {
    //     this.snackbar.open('Failed to upload Image ...!', '', { type: 'warning' });
    //     this.closeDialog('profiles-close-modal');
    //   });
  }

  delete() {
    this.dialogPhotoUrl = null;
    this.file = null;
  }

  ngOnDestroy() {
    this.idle.stop();
    if (this.dialogRef && this.dialog.openDialogs.length) {
      this.dialogRef.close();
    }
    this.idleEnd.unsubscribe();
    this.idleTimeOut.unsubscribe();
    this.onIdleStart.unsubscribe();
  }

}


