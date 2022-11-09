import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';

@Component({
  selector: 'app-add-api-dialog',
  templateUrl: './add-api-dialog.component.html',
  styleUrls: ['./add-api-dialog.component.scss']
})
export class AddApiDialogComponent implements OnInit {

  divider: any = {
    configSection: 100,
    jsonSection: 0
  }
  action: string;
  api_data: any;
  typeField: any[] = ['text', 'number', 'email', 'password', 'file']
  methodTypeField: any[] = ['GET', 'PUT', 'POST', 'DELETE']
  ResBody: any = {}
  apiPermission = {
    update: false,
    view: false,
    delete: false,
  }
  selectedFile: any;

  constructor(private apiRequest: RequestApiService,
    private snackbar: SnackbarService,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<AddApiDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.api_data = { ...data };
    this.action = this.api_data.action;
  }

  ngOnInit(): void {
    let permissionsForApi = this.authenticationService.getPermissions();
    this.apiPermission = {
      view: permissionsForApi.includes('VIEW_API'),
      update: permissionsForApi.includes('UPDATE_API'),
      delete: permissionsForApi.includes('DELETE_API'),
    }

  }

  onApiTestConnection() {

    let reqObj = this.api_data;
    if (this.api_data.methodType == 'GET' || this.api_data.methodType == 'DELETE') {
      this.api_data.body = [];
    }
    // this.apiRequest.testApiConnection(reqObj)
    //   .subscribe((res: any) => {
    //     if (res) {
    //       this.ResBody = res;
    //       this.snackbar.open('Connection established successfully...!', '', { type: 'success' });
    //     } else {
    //       this.ResBody = {};
    //       this.snackbar.open('Something went wrong ...!', '', { type: 'warning' });
    //     }
    //   }, (error: any) => {
    //     this.ResBody = {};
    //     this.snackbar.open('Failed To test connection ...!', '', { type: 'warning' });
    //   })
  }

  addParamField() {
    if (!this.api_data.params) {
      this.api_data.params = [];
    }
    this.api_data.params.unshift({ key: '', value: '' })
  }

  addHeaderField() {
    if (!this.api_data.headers) {
      this.api_data.headers = [];
    }
    this.api_data.headers.unshift({ key: '', value: '' })
  }

  addBodyField() {
    if (!this.api_data.body) {
      this.api_data.body = [];
    }
    this.api_data.body.unshift({
      fieldId: this.api_data.body.length + 1,
      fieldName: '',
      type: '',
      value: ''
    })
  }

  onFileUpload(file: any) {
    if (file.files.length === 0) {
      this.selectedFile = null;
      return;
    }
    const reader = new FileReader();
    this.selectedFile = file.files[0];
    file.files = null;
  }

  validateEndpoint() {
    let url = this.api_data.endPoint;
    let params = '';
    if (url.includes('?')) {

      let paramsString = url.split('?')[1];
      url = url.split('?')[0];
      params = paramsString.split('&').map((param: any) => {
        if (param.includes('=')) {
          param = param.split('=').map((val: any) => val.trim()).join('=');
        }
        return param
      }).join('&');
      this.api_data.endPoint = url.replace(/\s/g, "") + '?' + params;
    } else {
      this.api_data.endPoint = url.replace(/\s/g, "");
    }
  }

  trim(el: any) {
    this.api_data.apiName = this.rem(el)
  }

  trims(el: any) {
    this.api_data.endPoint = this.rem(el)
  }

  rem(j: any) {
    return j.value?.
      replace(/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
      replace(/[ ]{2,}/gi, " "). // replaces multiple spaces with one space 
      replace(/\n +/, "\n").
      replace()
  }

  removeParamField(index: any) {
    this.api_data.params.splice(index, 1)
  }

  removeHeaderField(index: any) {
    this.api_data.headers.splice(index, 1)
  }

  removeBodyField(index: any) {
    this.api_data.body.splice(index, 1)
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  doAction() {
    this.validateEndpoint()
    this.dialogRef.close({ event: this.action, data: this.api_data });
  }

}
