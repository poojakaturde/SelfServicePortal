import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-project-attributes',
  templateUrl: './project-attributes.component.html',
  styleUrls: ['./project-attributes.component.scss']
})
export class ProjectAttributesComponent implements OnInit {

  @Input() projectInfoForm: any;
  @Input() step: any;
  @Output() setStep: EventEmitter<any> = new EventEmitter();
  @Input() dataSource: any;
  @Input() isMandatoryHeader!: boolean;
  @Output() isMandatoryHeaderChange: EventEmitter<any> = new EventEmitter();
  @Output() dataSourceChange: EventEmitter<any> = new EventEmitter();
  @Input() attributeList: any[] = [];
  @Input() attrListForSemiStructure: any[] = [];
  @Input() attrListForInmarReturns: any[] = [];
  @Input() attributeListChange: any[] = [];
  @Input() headerListForInmar: any[] = [];
  @Input() columnHeadersForInmar: any;
  @Input() columnHeadersForInmarType: any;
  @Output() columnHeadersForInmarChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  displayedColumns: string[] = ['attributeName', 'validation', 'action', 'mandatoryAttributes'];


  toggleCheckboxAll(event: any) {
    const checked = event.checked;
    this.dataSource.data.forEach((item: any) => item.isMandatory = checked);
    this.isMandatoryHeaderChange.emit(this.isMandatoryHeader);
  }

  checkUncheckIsMandatory() {
    let index = this.dataSource.data.findIndex((item: any) => item.isMandatory === false);
    this.isMandatoryHeader = index >= 0 ? false : true;
    this.isMandatoryHeaderChange.emit(this.isMandatoryHeader);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource'] && changes['dataSource'].currentValue) {
    }
  }

  deleteAttribute(index: any) {
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
    this.dataSourceChange.emit(this.dataSource)
    this.checkUncheckIsMandatory();
  }

  addFields(attribute: any) {
    this.dataSource.data = [...this.dataSource.data, attribute];
    this.dataSourceChange.emit(this.dataSource)
    this.checkUncheckIsMandatory();
  }
  getattributeList(searchKey: any) {
    return this.attributeList.filter(attribute => attribute.name.toLowerCase().includes(searchKey.toLowerCase()))
  }
  getfilterattributeList(searchKey: any, list: any) {
    let data = list.filter((attribute: any) => attribute.name.toLowerCase().includes(searchKey.toLowerCase()))
    return data.filter((attribute: any) => {
      let index = this.dataSource.data.findIndex((x: any) => x.name === attribute.name)
      if (index === -1) {
        return true;
      } else {
        return false;
      }
    })
  }
  getattrListForSemiStructure(searchKey: any) {
    return this.attributeListChange.filter(attribute => attribute.name.toLowerCase().includes(searchKey.toLowerCase()))
  }

  deleteColumnHeadersForInmar(index: any) {
    this.columnHeadersForInmar.data.splice(index, 1);
    this.columnHeadersForInmar._updateChangeSubscription();
    this.columnHeadersForInmarChange.emit(this.columnHeadersForInmar)
  }

  addColumnHeaders(attribute: any) {
    this.columnHeadersForInmar.data = [...this.columnHeadersForInmar.data, attribute];
    this.columnHeadersForInmarChange.emit(this.columnHeadersForInmar)
  }

  getColumnHeadersForInmar(searchKey: any) {
    return this.headerListForInmar.filter(attribute => attribute.name.toLowerCase().includes(searchKey.toLowerCase()))
  }

  getfilterColumnHeaders(searchKey: any, list: any) {
    let data = list.filter((attribute: any) => attribute.name.toLowerCase().includes(searchKey.toLowerCase()))
    return data.filter((attribute: any) => {
      let index = this.columnHeadersForInmar.data.findIndex((x: any) => x.name === attribute.name)
      if (index === -1) {
        return true;
      } else {
        return false;
      }
    })
  }

}
