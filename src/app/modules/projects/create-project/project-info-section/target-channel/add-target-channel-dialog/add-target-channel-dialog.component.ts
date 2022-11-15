import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';

@Component({
  selector: 'app-add-target-channel-dialog',
  templateUrl: './add-target-channel-dialog.component.html',
  styleUrls: ['./add-target-channel-dialog.component.scss']
})
export class AddTargetChannelDialogComponent implements OnInit {

  divider: any = {
    configSection: 100,
    jsonSection: 0
  }
  EditChannel!: FormGroup;
  action: string;
  channel_data: any;
  methodTypeField: any[] = ['POST']
  ResBody: any = {}
  showTestConButton: boolean = false;
  schema: any;

  constructor(private apiRequest: RequestApiService,
    private snackbar: SnackbarService,
    private formBilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<AddTargetChannelDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.channel_data = { ...data };
    this.action = this.channel_data.action;
    this.schema = this.channel_data.schema;
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.EditChannel = this.formBilder.group({
      channelType: new FormControl(this.channel_data.channelType, [Validators.required]),
      channelName: new FormControl(this.channel_data.channelName, [Validators.required]),
      methodType: new FormControl('POST', [Validators.required]),
      endPoint: new FormControl(this.channel_data.endPoint, [Validators.required]),
      secretKey: new FormControl(this.channel_data.secretKey, []),
    });
  }

  onChannelTypeChange() {
    this.EditChannel.controls['methodType'].setValue('POST');
  }

  onChannelTestConnection() {
    if (!this.EditChannel.valid) {
      this.snackbar.open('Please fill all fields for target channel.', '', { type: 'warning' });
      return;
    }
    let reqObj: any = {
      "body": [],
      "endPoint": this.channel_data.endPoint,
      "methodType": this.EditChannel.controls['methodType'].value,
      "headers": {
        "secretKey": this.channel_data.secretKey
      }
    }
    this.apiRequest.testTargetChannelConnection(reqObj)
      .subscribe((res: any) => {
        if (res) {
          this.showTestConButton = true;
          this.ResBody = res;
          this.snackbar.open('Connection established successfully...!', '', { type: 'success' });
        } else {
          this.ResBody = {};
          this.snackbar.open('Something went wrong ...!', '', { type: 'warning' });
        }
      }, (error: any) => {
        this.ResBody = {};
        if (error && error.description) {
          this.snackbar.open(error.description, '', { type: 'warning' });
        }
      })
  }

  trim(el: any) {
    this.channel_data.channelName = this.rem(el)
  }

  trims(el: any) {
    this.channel_data.endPoint = this.rem(el)
  }

  rem(j: any) {
    return j.value?.
      replace(/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
      replace(/[ ]{2,}/gi, " "). // replaces multiple spaces with one space 
      replace(/\n +/, "\n").
      replace()
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  doAction() {
    if (!this.EditChannel.valid) {
      this.snackbar.open('Please fill all fields for target channel.', '', { type: 'warning' });
      return;
    }
    this.dialogRef.close({ event: this.action, data: this.channel_data });
  }

}
