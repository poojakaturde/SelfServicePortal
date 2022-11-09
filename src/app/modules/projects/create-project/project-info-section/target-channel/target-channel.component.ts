import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { AddTargetChannelDialogComponent } from './add-target-channel-dialog/add-target-channel-dialog.component';

@Component({
  selector: 'app-target-channel',
  templateUrl: './target-channel.component.html',
  styleUrls: ['./target-channel.component.scss']
})
export class TargetChannelComponent implements OnInit {

  @Input() step: any;
  @Output() setStep: EventEmitter<any> = new EventEmitter();
  @Input() projectInfoForm: any;
  @Input() dataSourceForTargetChannel: any;
  @Output() dataSourceForTargetChannelChange: EventEmitter<any> = new EventEmitter();

  constructor(private snackbar: SnackbarService,
    private dialog: MatDialog) { }

  displayedColumnsForChannels: string[] = ['channelType', 'channelName', 'endPoint', 'createdDate', 'updatedDate', 'action'];

  ngOnInit(): void {

  }

  openChannelDialog(action: any, channelData: any, index: any) {
    let selectedValues: any;
    if (action === 'Add') {
      channelData = {
        'channelType': "",
        'channelName': "",
        'action': "Add",
        'endPoint': "",
        'secretKey': "",
        'schema': {},
        isEnabled: true,
        status: "enabled"
      }
    }
    else {
      selectedValues = channelData;
      channelData = JSON.parse(JSON.stringify(selectedValues));
    }
    channelData.action = action;
    let dialog = this.dialog.open(AddTargetChannelDialogComponent, {
      data: { ...channelData },
      disableClose: true,
    })

    dialog.afterClosed().subscribe(channel => {
      if (channel.event === 'Add') {
        this.addRowData(channel.data);
      } else if (channel.event === 'Update') {
        this.updateRowData(channel.data, index);
      } else if (channel.event === 'Delete') {
        this.deleteRowData(index);
      }
    });
  }

  addRowData(row_obj: any): any {
    let reqObj = {
      ...row_obj,
      "isTargetChannelCreated": true,
      "isTargetChannelUpdated": false,
    }
    const found = this.dataSourceForTargetChannel.data.findIndex((el: any) => el.channelName === row_obj.channelName);
    if (found > -1) {
      this.snackbar.open('Channel name already exist', '', { type: 'warning' });
      return false;
    }
    delete reqObj.action;
    this.dataSourceForTargetChannel.data.push(reqObj)
    this.dataSourceForTargetChannel._updateChangeSubscription();
    this.dataSourceForTargetChannelChange.emit(this.dataSourceForTargetChannel);
  }

  updateRowData(row_obj: any, index: any): any {
    let reqObjs = {
      ...row_obj,
      "isTargetChannelUpdated": true,
    }
    delete reqObjs.action;
    this.dataSourceForTargetChannel.data.splice(index, 1);
    const found = this.dataSourceForTargetChannel.data.findIndex((el: any) => el.channelName === row_obj.channelName);
    if (found > -1) {
      this.snackbar.open('Channel name already exist', '', { type: 'warning' });
      return false;
    }
    this.dataSourceForTargetChannel.data.splice(index, 0, reqObjs);
    this.dataSourceForTargetChannel.data[index] = reqObjs
    this.dataSourceForTargetChannel._updateChangeSubscription();
    this.dataSourceForTargetChannelChange.emit(this.dataSourceForTargetChannel);
  }

  deleteRowData(index: any) {
    this.dataSourceForTargetChannel.data.splice(index, 1)
    this.dataSourceForTargetChannel._updateChangeSubscription();
    this.dataSourceForTargetChannelChange.emit(this.dataSourceForTargetChannel);
  }

  onChannelStatusChange(index: any, event: any) {
    const status = event.checked ? 'enabled' : 'disabled';
    this.dataSourceForTargetChannel.data[index].status = status;
    this.dataSourceForTargetChannel.data[index].isEnabled = status === 'enabled' ? true : false;
    this.dataSourceForTargetChannelChange.emit(this.dataSourceForTargetChannel);
  }
}
