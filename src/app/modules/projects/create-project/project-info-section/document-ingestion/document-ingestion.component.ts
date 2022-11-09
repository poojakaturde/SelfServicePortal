import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { CreateProjectInternalCommunicationService } from '../../Services/create-project-internal-communication.service';

@Component({
  selector: 'app-document-ingestion',
  templateUrl: './document-ingestion.component.html',
  styleUrls: ['./document-ingestion.component.scss']
})
export class DocumentIngestionComponent implements OnInit {

  @Input() step: any;
  @Input() isCreateProjectOperation: any;
  @Input() isSourceVerifiedChange: any;
  @Input() sourceTypeList: any;
  @Input() srcImagePath: any;
  @Input() projectInfoForm: any;
  @Input() SourceChannelResponse: any;

  @Output() testedSourceDataChange: EventEmitter<any> = new EventEmitter();
  @Output() isSourceVerifiedChanged: EventEmitter<any> = new EventEmitter();
  @Output() SourceChannelfilenameChange: EventEmitter<any> = new EventEmitter();
  @Output() fileIndexChange: EventEmitter<any> = new EventEmitter();
  @Output() sourceChanelForm1Change: EventEmitter<any> = new EventEmitter();
  @Output() sourceListChange: EventEmitter<any> = new EventEmitter();
  @Output() isSourceDataChange: EventEmitter<any> = new EventEmitter();
  @Output() setStep: EventEmitter<any> = new EventEmitter();
  constructor(
    private snackbar: SnackbarService,
    private apiRequest: RequestApiService,
    private cpicomm: CreateProjectInternalCommunicationService) { }
  isSourceavailable = false;
  sourceChanelForm1!: any;
  sourceImgObj: any = {
    'GCP Bucket (Default)': './assets/icons/GCPBucket.png',
    'Google Drive': './assets/icons/googleDrive.png',
    'Amazon S3': './assets/icons/amazonS3Icon.png'
  }
  sourceSelectedFile: any;
  isSourceVerified = false;
  channelErrorMsg = '';
  testedSourceData: any = {};
  testedSourceDataDummy: any = {};
  showPassword = true;
  isSourceTestVisible = false;
  SourceTestMessage = '';
  SourceChannelfilename = '';
  isEmailvalid = true;
  fileIndex: any;
  folderId: any;
  sourceList: any;
  projectEditData: any;

  ngOnInit(): void {
    if (this.isCreateProjectOperation) {
      this.apiRequest.getSourceList().subscribe(
        (res: any) => {
          if (res && res.detail) {
            this.sourceList = res.detail;
            this.sourceListChange.emit(this.sourceList);
            this.SourceChannelResponse.channelType = "GCP Bucket (Default)";
            this.SourceChannelResponse.folderId = null;
            this.sourceTypeList = res.detail['channels'];
            this.sourceChanelChange("GCP Bucket (Default)")
          }

        }, (error: any) => {
          this.snackbar.open('Failed to fetch Sourcelist data', '', { type: 'warning' })
        }
      )
    } else {
      this.projectEditData = this.cpicomm.sourceOb$.subscribe(
        (data: any) => {
          if (data) {
            this.apiRequest.getSourceList().subscribe(
              (res: any) => {
                if (res && res.detail) {
                  this.sourceList = res.detail;
                  this.sourceListChange.emit(this.sourceList);
                  this.sourceTypeList = res.detail['channels'];
                  this.sourceChanelChange(data.channelType)
                  this.setSourceValue(data)
                  this.folderId = data.folderId;
                }
              }, (error: any) => {
                this.snackbar.open('Failed to fetch Sourcelist data', '', { type: 'warning' })
              }
            )
          }
        }
      );
    }
  }

  sourceChanelChange(event: any) {
    this.sourceSelectedFile = null;

    this.fileIndex = null;
    this.fileIndexChange.emit(this.fileIndex);
    if (event === 'GCP Bucket (Default)') {
      this.isSourceVerified = true;
      this.isSourceVerifiedChanged.emit(this.isSourceVerified)
    } else {
      this.isSourceVerified = false;
      this.isSourceVerifiedChanged.emit(this.isSourceVerified)
    }
    let obj: any = {};
    this.sourceChanelForm1 = null;
    this.sourceList[event].forEach((form: any, index: any) => {
      if (form.type === 'email') {
        obj[form.fieldName] = new FormControl('', [Validators.required, Validators.email])
      }
      else if (form.required) {
        obj[form.fieldName] = new FormControl('', [Validators.required])
      } else {
        obj[form.fieldName] = new FormControl('')
      }
      if (form.type === 'file') {
        this.fileIndex = index;
        this.fileIndexChange.emit(this.fileIndex);
      }
    });
    this.sourceChanelForm1 = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.pattern('^([a-zA-Z0-9\\s])+([a-zA-Z0-9\\s()]+)*(-[\(\)a-zA-Z0-9\\s]+)*$'), Validators.minLength(1), Validators.maxLength(75)]),
        sourceChannel: new FormControl(event, [Validators.required]),
        status: new FormControl('Enabled'),
        verified: new FormControl(false),
        details: new FormGroup(obj)
      }
    );
    this.isSourceavailable = true;
    this.sourceChanelForm1Change.emit(this.sourceChanelForm1);

  }

  validateChannelForm() {
    if (this.sourceChanelForm1.get('name').errors) {
      if (this.sourceChanelForm1.get('name').errors.required)
        this.channelErrorMsg = 'Can not be blank';
      else if (this.sourceChanelForm1.get('name').errors.pattern)
        this.channelErrorMsg = 'Only alphabets digits - ( )';
      else if (this.sourceChanelForm1.get('name').errors.minlength)
        this.channelErrorMsg = 'At least ' + this.projectInfoForm.get('project').errors.minlength.requiredLength + ' characters';
      else if (this.sourceChanelForm1.get('name').errors.maxlength)
        this.channelErrorMsg = 'At max ' + this.projectInfoForm.get('project').errors.maxlength.requiredLength + ' characters';
    }
  }
  sourceDataChanged(val: any, fieldname: any) {
    if (val.value !== this.testedSourceData[fieldname]) {
      this.isSourceDataChange.emit(true);
    } else {
      this.isSourceDataChange.emit(false);
    }
  }

  onSourceTargetFileUpload(i: any, file: any) {
    if (file.files.length === 0) {
      return;
    }
    this.sourceSelectedFile = file.files[0];
    let selectedFile = file.files[0];
    file.files = null;
    i.value = selectedFile.name;
    return;
  }

  onTestConnection() {
    let validate = true;
    let obj: any = this.getSourceValue()
    let requsetData: any = {};
    obj.details.forEach((data: any) => {

      if (data.value.trim() !== '') {
        requsetData[data.fieldName] = data.value;
      } else {
        if (data.type !== 'file') {
          validate = false;
        }
      }
    });
    if ((this.sourceChanelForm1.controls['name'].status !== "VALID")) {
      validate = false;
    }
    if (!this.isEmailvalid) {
      validate = false;
    }
    requsetData['channelName'] = obj.channelName;
    requsetData['channelType'] = obj.channelType;
    requsetData['projectName'] = this.projectInfoForm.controls['project'].value;
    requsetData['action'] = this.isCreateProjectOperation ? 'Create' : 'Update';
    if (this.testedSourceData.projectName) {
      requsetData['oldProjectName'] = this.testedSourceData.projectName;
    } else {
      requsetData['oldProjectName'] = '';
    }

    this.testedSourceDataDummy = requsetData;
    if (validate && (this.projectInfoForm.controls['project'].status === "VALID" || this.projectInfoForm.controls['project'].status === "DISABLED")) {
      if (this.sourceSelectedFile) {
        this.apiRequest.testSourceConnection1(obj.channelType, requsetData, this.sourceSelectedFile).subscribe((res: any) => {
          if (res.status === 'S') {
            if (res && res.description && res.detail) {
              this.sendTestedData(res);
            } else {
              this.isSourceTestVisible = true;
              this.SourceTestMessage = res.description;
            }
          } else {
            this.isSourceTestVisible = true;
            this.SourceTestMessage = res.description;
          }

        }, (error: any) => {
          this.isSourceTestVisible = true;
          this.SourceTestMessage = "Test Connection Failed";
          // this.snackbar.open('Failed to get authentication URL', '', { type: 'warning' })
        });
      }
      else {
        this.apiRequest.testSourceConnection(obj.channelType, requsetData).subscribe((res: any) => {
          if (res.status === 'S') {
            if (res && res.description && res.detail) {
              this.sendTestedData(res);
            } else {
              this.isSourceTestVisible = true;
              this.SourceTestMessage = res.description;
            }
          } else {
            this.isSourceTestVisible = true;
            this.SourceTestMessage = res.description;
          }

        }, (error: any) => {
          this.isSourceTestVisible = true;
          this.SourceTestMessage = "Test Connection Failed";
          // this.snackbar.open('Failed to get authentication URL', '', { type: 'warning' })
        });
      }
    } else {
      this.isSourceTestVisible = true;
      this.SourceTestMessage = "Please check details and try again";
    }

  }

  sendTestedData(res: any) {
    this.isSourceTestVisible = true;
    this.SourceTestMessage = res.description;
    this.SourceChannelfilename = res.detail;
    this.sourceChanelForm1.value.verified = true;
    this.isSourceVerified = true;
    this.isSourceVerifiedChanged.emit(this.isSourceVerified)
    this.testedSourceData = this.testedSourceDataDummy;
    this.testedSourceDataChange.emit(this.testedSourceData);
    this.SourceChannelfilenameChange.emit(this.SourceChannelfilename);
    this.sourceChanelForm1Change.emit(this.sourceChanelForm1);
    this.isSourceDataChange.emit(false);
  }
  getSourceValue() {

    let data = this.sourceList[this.sourceChanelForm1.value.sourceChannel];
    let filterEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    data.forEach((e: any, index: any) => {
      if (e.type === 'email') {
        if (!filterEmail.test(this.sourceChanelForm1.value.details[e.fieldName])) {
          this.isEmailvalid = false;
        } else {
          this.isEmailvalid = true;
        }
      }
      e.value = this.sourceChanelForm1.value.details[e.fieldName];
    });
    let obj = {
      channelName: this.sourceChanelForm1.value.sourceChannel === 'GCP Bucket (Default)' ? 'GCP Bucket (Default)' : this.sourceChanelForm1.value.name,
      channelType: this.sourceChanelForm1.value.sourceChannel,
      status: this.sourceChanelForm1.value.status ? 'enabled' : 'disabled',
      verified: true,
      details: data,
      channelId: this.SourceChannelResponse.channelId || null,
      folderId: this.SourceChannelResponse.folderId || null,
      notifications: this.SourceChannelResponse.notifications || null,
      pageToken: this.SourceChannelResponse.pageToken || null,
      resourceId: this.SourceChannelResponse.resourceId || null
    }

    if (obj.channelType !== "GCP Bucket (Default)") {
      obj.folderId = this.folderId || null;
      obj.verified = this.isSourceVerified;
      this.sourceChanelForm1.value.verified = this.isSourceVerified;
    } else {
      this.sourceChanelForm1.value.verified = true;
    }
    return obj;
  }

  setSourceValue(data: any) {
    let detailobj: any = {}
    data.details.forEach((e: any) => {
      detailobj[e.fieldName] = e.value;
    });
    this.isSourceVerified = data.verified;
    this.isSourceVerifiedChanged.emit(this.isSourceVerified)
    let obj = {
      name: data.channelName,
      sourceChannel: data.channelType,
      status: data.status === 'enabled' ? true : false,
      verified: data.verified,
      details: detailobj
    }
    this.sourceChanelForm1.patchValue(obj);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.projectEditData) {
      this.projectEditData.unsubscribe();
    }
  }

}
