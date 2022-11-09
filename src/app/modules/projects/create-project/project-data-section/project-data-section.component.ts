import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-project-data-section',
  templateUrl: './project-data-section.component.html',
  styleUrls: ['./project-data-section.component.scss']
})
export class ProjectDataSectionComponent implements OnInit {

  @Input() projectInfoForm: any;
  @Input() dataSourceForTemplates: any;
  @Input() step: any;
  @Input() drlAttributeList: any;

  @Input() CustomDataInfoForm: any;
  @Input() categoryList: any;
  @Input() categoryLists: any;
  @Input() datasetList: any;
  @Input() dataSourceForDatasets: any;
  @Input() dataSourceForCustomData: any;
  @Input() dataSourceForDisplayHeader: any;
  @Input() addedObj: any;

  @Input() dataSourceForVariables: any;
  @Input() operatorListByValidation: any;

  @Output() setStep: EventEmitter<any> = new EventEmitter();
  @Output() stepChange: EventEmitter<any> = new EventEmitter();
  @Output() dataSourceForCustomDataChange: EventEmitter<any> = new EventEmitter();
  @Output() dataSourceForVariablesChange: EventEmitter<any> = new EventEmitter();
  @Output() dataSourceForDatasetsChange: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

}
