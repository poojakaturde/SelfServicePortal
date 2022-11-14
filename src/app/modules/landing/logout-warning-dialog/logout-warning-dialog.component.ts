import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { scan, takeWhile } from 'rxjs/operators';
import { timer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-logout-warning-dialog',
  templateUrl: './logout-warning-dialog.component.html',
  styleUrls: ['./logout-warning-dialog.component.scss']
})
export class LogoutWarningDialogComponent implements OnInit {

  sessionTimeOut = environment.userSessionTimeOut;

  timer$: any = timer(0, 1000).pipe(
    scan(acc => --acc, environment.userSessionTimeOut),
    takeWhile(x => x >= 0)
  )

  public percentage: number = (this.timer$ / this.sessionTimeOut) * 100;
  public final = Number('percentage')

  constructor(public modaldialogRef: MatDialogRef<LogoutWarningDialogComponent>) {
    // this.percentage = Number(this.timer$ / this.sessionTimeOut * 100)
  }

  logout(status: any) {
    this.modaldialogRef.close(status);
  }
  ngOnInit(): void {
  }

}
