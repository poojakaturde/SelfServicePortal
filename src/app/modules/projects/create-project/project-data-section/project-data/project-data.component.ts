import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-project-data',
  templateUrl: './project-data.component.html',
  styleUrls: ['./project-data.component.scss']
})
export class ProjectDataComponent implements OnInit {

  @Input() projectInfoForm: any;
  @Input() dataSourceForTemplates: any;
  @Input() step: any;
  @Input() drlAttributeList: any;
  @Output() setStep: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
