import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-project-entitys',
  templateUrl: './project-entitys.component.html',
  styleUrls: ['./project-entitys.component.scss']
})
export class ProjectEntitysComponent implements OnInit {

  @Input() projectInfoForm: any;
  @Input() step: any;
  @Output() setStep: EventEmitter<any> = new EventEmitter();
  @Input() dataSource: any;
  @Output() dataSourceChange: EventEmitter<any> = new EventEmitter();
  @Input() attributeListRCM: any[] = [];
  constructor() { }

  displayedColumns: string[] = ['attributeName', 'validation', 'action'];

  ngOnInit(): void {
  }

  deleteAttribute(index: any) {
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
    this.dataSourceChange.emit(this.dataSource)

  }

  addFields(attribute: any) {
    this.dataSource.data = [...this.dataSource.data, attribute];
    this.dataSourceChange.emit(this.dataSource)
  }
  getattributeListRCM(searchKey: any) {
    return this.attributeListRCM.filter(attribute => attribute.name.toLowerCase().includes(searchKey.toLowerCase()))
  }
}
