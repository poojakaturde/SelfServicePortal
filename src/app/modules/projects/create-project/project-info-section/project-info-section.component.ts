import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-project-info-section',
  templateUrl: './project-info-section.component.html',
  styleUrls: ['./project-info-section.component.scss']
})
export class ProjectInfoSectionComponent implements OnInit {

  @Input() projectInfoForm: any;
  @Input() isProjectReadOnly: any;
  @Input() projectErrorMsg: any;
  @Input() userList: any;
  @Input() dataSource: any;
  @Input() isMandatoryHeader!: boolean;
  @Output() isMandatoryHeaderChange: EventEmitter<any> = new EventEmitter();
  @Input() straightThroughScore: any;
  @Input() minDate: any;
  @Output() projectInfoFormChange: EventEmitter<any> = new EventEmitter();
  @Output() straightThroughScoreChange: EventEmitter<any> = new EventEmitter();
  @Output() setStep: EventEmitter<any> = new EventEmitter();


  //template section
  @Input() dataSourceForTemplates: any;
  @Input() templateList: any;
  @Input() step: any;
  @Output() dataSourceChange: EventEmitter<any> = new EventEmitter();
  @Output() dataSourceForTemplatesChange: EventEmitter<any> = new EventEmitter();
  @Input() selectedProjectInfo: any;
  @Input() selectedRoles: any;
  @Input() roleList: any[] = [];

  @Input() attrListForSemiStructure: any;
  @Input() attributeListChange: any;
  @Input() attrListForInmarReturns: any;
  @Input() headerListForInmar: any;
  @Input() columnHeadersForInmar: any;
  @Output() columnHeadersForInmarChange: EventEmitter<any> = new EventEmitter();
  @Input() columnHeadersForInmarType: any;
  @Input() attributeList: any;
  @Input() attributeListRCM: any;

  @Output() selectedProjectInfoChange: EventEmitter<any> = new EventEmitter();
  @Output() selectedRolesChange: EventEmitter<any> = new EventEmitter();


  @Input() dataSourceForDatasets: any;
  @Input() datasetList: any;
  @Input() categoryList: any;
  @Output() dataSourceForDatasetsChange: EventEmitter<any> = new EventEmitter();

  @Input() dataSourceForApi: any;
  @Output() dataSourceForApiChange: EventEmitter<any> = new EventEmitter();

  @Input() dataSourceForTargetChannel: any;
  @Output() dataSourceForTargetChannelChange: EventEmitter<any> = new EventEmitter();

  //document integration
  @Input() sourceList: any;
  @Input() sourceTypeList: any;
  @Input() srcImagePath: any;
  @Input() SourceChannelResponse: any;
  @Input() isCreateProjectOperation: any;
  @Input() testedSourceData: any;
  @Input() isSourceVerifiedChange: any;
  @Output() isSourceVerifiedChanged: EventEmitter<any> = new EventEmitter();
  @Output() SourceChannelfilenameChange: EventEmitter<any> = new EventEmitter();
  @Output() fileIndexChange: EventEmitter<any> = new EventEmitter();
  @Output() sourceChanelForm1Change: EventEmitter<any> = new EventEmitter();
  @Output() sourceListChange: EventEmitter<any> = new EventEmitter();
  @Output() isSourceDataChange: EventEmitter<any> = new EventEmitter();
  // @Output()srcImagePathChange : EventEmitter<any> = new EventEmitter();

  constructor() { }

  displayedColumns: string[] = ['attributeName', 'validation', 'action'];

  ngOnInit(): void {
  }

  mandatoryValueChange(val: any) {
    this.isMandatoryHeaderChange.emit(val);
  }


}
