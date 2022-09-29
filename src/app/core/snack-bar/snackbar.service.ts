import { Injectable, Type } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

interface ISnackbar {
  duration?: number;
  type?: string ;
}

interface IPanelClass {
  success: Array<string>;
  error: Array<string>;
  warning: Array<string>;
}

@Injectable({
  providedIn: 'root'
})

export class SnackbarService {

  static panelClass: IPanelClass = {
    success: ['success'],
    error: ['error'],
    warning: ['warning']
  };

  private toastConfig: MatSnackBarConfig = {
    duration: 3000,
    panelClass: [],
    verticalPosition: 'top',
    horizontalPosition: 'center'
  };

  constructor(private snackBar: MatSnackBar) { }

  open(message: string, action: string, config?: ISnackbar) {
    if (config) {
      const type = config.type || '';
      if (type && SnackbarService.panelClass.hasOwnProperty(type)) {
        this.toastConfig.panelClass =  ['toast-'+type];

      }
      this.toastConfig.duration = config.duration || 2000;
    }
    this.snackBar.open(message, action, this.toastConfig);
  }

  close() {
    this.snackBar.dismiss();
  }
}
