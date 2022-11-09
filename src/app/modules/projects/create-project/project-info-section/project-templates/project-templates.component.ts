import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-project-templates',
  templateUrl: './project-templates.component.html',
  styleUrls: ['./project-templates.component.scss']
})
export class ProjectTemplatesComponent implements OnInit {

  @Input() projectInfoForm: any;
  @Input() step: any;
  @Output() setStep: EventEmitter<any> = new EventEmitter();
  @Input() dataSourceForTemplates: any;
  @Output() dataSourceForTemplatesChange: EventEmitter<any> = new EventEmitter();
  @Input() templateList: any[] = [];
  constructor() { }
  displayedColumnsForTemplates: string[] = ['name', 'pages', 'trained', 'created', 'updated', 'action'];
  ngOnInit(): void {
  }

  onTemplateStatusChange(index: any, event: any) {
    const status = event.checked ? 'enabled' : 'disabled';
    this.dataSourceForTemplates.data[index].status = status;
    this.dataSourceForTemplatesChange.emit(this.dataSourceForTemplates)
  }

  toDeleteTemplate(index: any) {
    this.dataSourceForTemplates.data.splice(index, 1);
    this.dataSourceForTemplates._updateChangeSubscription();
    this.dataSourceForTemplatesChange.emit(this.dataSourceForTemplates)
  }

  addSelectedTemleteList(template: any) {
    this.dataSourceForTemplates.data.push(template);
    this.dataSourceForTemplates._updateChangeSubscription();
    this.dataSourceForTemplatesChange.emit(this.dataSourceForTemplates)
  }

  gettemplateList(searchKey: any) {
    return this.templateList.filter(template => template.name.toLowerCase().includes(searchKey.toLowerCase()))
  }

}
