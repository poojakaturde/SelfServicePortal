import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { AddApiDialogComponent } from './add-api-dialog/add-api-dialog.component';

@Component({
  selector: 'app-api-configuration',
  templateUrl: './api-configuration.component.html',
  styleUrls: ['./api-configuration.component.scss']
})
export class ApiConfigurationComponent implements OnInit {

  @Input() step: any;
  @Output() setStep: EventEmitter<any> = new EventEmitter();
  @Input() dataSourceForApi: any;
  @Output() dataSourceForApiChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
  ) { }

  displayedColumnsForAPIs: string[] = ['apiName', 'endPoint', 'createdDate', 'updatedDate'];
  apiData: any = [];
  apiPermission = {
    update: false,
    view: false,
    //  delete: false,
  }

  ngOnInit(): void {
    let permissionsForApi = this.authenticationService.getPermissions();
    this.apiPermission = {
      view: permissionsForApi.includes('VIEW_API'),
      update: permissionsForApi.includes('UPDATE_API'),
    }
    if (this.apiPermission.update) {
      this.displayedColumnsForAPIs.push('action');
    }
  }

  openConfigDialog(action: any, apiData: any, index: any) {
    if (this.apiPermission.update) {
      apiData.action = action;
      let dialog = this.dialog.open(AddApiDialogComponent, {
        data: apiData,
        disableClose: true,
      })

      dialog.afterClosed().subscribe((api: any) => {
        if (api.event === 'Add') {
          this.addRowData(api.data);
        } else if (api.event === 'Update') {
          this.updateRowData(api.data, index);
        } else if (api.event === 'Delete') {
          this.deleteRowData(index);
        }
      });
    }
  }

  addRowData(row_obj: any): any | void {
    let reqObj: any = {};
    reqObj = {
      ...row_obj,
      isEnabled: true,
      status: "enabled",
      "createdApi": true,
      "updatedApi": false,
    }
    const found = this.dataSourceForApi.data.findIndex((el: any) => el.apiName === row_obj.apiName);
    if (found > -1) {
      this.snackbar.open('Api Name already exist', '', { type: 'warning' });
      return false;
    }
    delete row_obj.action;
    this.dataSourceForApi.data.push(reqObj)
    this.dataSourceForApi._updateChangeSubscription();
    this.dataSourceForApiChange.emit(this.dataSourceForApi);
  }

  updateRowData(row_obj: any, index: any): any | void {
    delete row_obj.action;
    let reqObjs = {
      ...row_obj,
      "updatedApi": true,
    }

    this.dataSourceForApi.data.splice(index, 1);
    const found = this.dataSourceForApi.data.findIndex((el: any) => el.apiName === row_obj.apiName);
    if (found > -1) {
      this.snackbar.open('Api Name Already Exist', '', { type: 'warning' });
      return false;
    }
    this.dataSourceForApi.data.splice(index, 0, reqObjs);

    this.dataSourceForApi.data[index] = reqObjs
    this.dataSourceForApi._updateChangeSubscription();
    this.dataSourceForApiChange.emit(this.dataSourceForApi);
  }

  deleteRowData(index: any) {
    this.dataSourceForApi.data.splice(index, 1)
    this.dataSourceForApi._updateChangeSubscription();
    this.dataSourceForApiChange.emit(this.dataSourceForApi);
  }

  onApiStatusChange(index: any, event: any, row_obj: any) {
    const status = event.checked ? 'enabled' : 'disabled';
    this.dataSourceForApi.data[index].status = status;
    this.dataSourceForApi.data[index].isEnabled = status === 'enabled' ? true : false;
    this.dataSourceForApiChange.emit(this.dataSourceForApi);
    this.updateRowData(row_obj, index);
  }

}
