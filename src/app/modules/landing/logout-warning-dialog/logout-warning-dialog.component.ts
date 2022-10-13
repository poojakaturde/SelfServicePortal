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

  constructor(public modaldialogRef: MatDialogRef<LogoutWarningDialogComponent>) { }

  logout(status: any) {
    this.modaldialogRef.close(status);
  }
  sessionTimeOut = environment.userSessionTimeOut;

  timer$ = timer(0, 1000).pipe(
    scan(acc => --acc, environment.userSessionTimeOut),
    takeWhile(x => x >= 0)
  )

  ngOnInit(): void {
  }

}
