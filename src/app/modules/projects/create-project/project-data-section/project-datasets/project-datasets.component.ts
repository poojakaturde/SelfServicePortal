import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-project-datasets',
  templateUrl: './project-datasets.component.html',
  styleUrls: ['./project-datasets.component.scss']
})
export class ProjectDatasetsComponent implements OnInit {

  @Input() step: any;
  @Input() categoryLists: any;
  @Output() setStep: EventEmitter<any> = new EventEmitter();
  @Input() dataSourceForDatasets: any;
  @Input() datasetList: any;
  @Input() categoryList: any[] = [];
  @Output() dataSourceForDatasetsChange: EventEmitter<any> = new EventEmitter();

  @Input() addedObj: any;

  data_set_list: any[] = [];

  constructor() {
  }

  selectedCategory: any = "";
  displayedColumnsForTemplates: string[] = ['name', 'pages', 'trained', 'created', 'updated', 'action'];
  ngOnInit(): void {
  }

  onDatasetsStatusChange(index: any, event: any) {
    const status = event.checked ? 'enabled' : 'disabled';
    this.dataSourceForDatasets.data[index].status = status;
    this.dataSourceForDatasetsChange.emit(this.dataSourceForDatasets);
  }



  toDeleteDatasets(index: any) {
    this.deleteObj(index);
    this.categoryLists[this.dataSourceForDatasets.data[index].categoryName].used = this.categoryLists[this.dataSourceForDatasets.data[index].categoryName].used - 1;
    this.dataSourceForDatasets.data.splice(index, 1);
    this.dataSourceForDatasets._updateChangeSubscription();
    this.dataSourceForDatasetsChange.emit(this.dataSourceForDatasets);
  }

  deleteObj(index: any) {
    let delObj = this.dataSourceForDatasets.data[index];
    this.addedObj[delObj.categoryName + '-' + delObj.datasetName] = false;
  }
  addComp(o1: any): boolean {
    let index = this.dataSourceForDatasets.data.findIndex((x: any) => x.datasetName === o1.datasetName && x.categoryName === o1.categoryName)
    if (index !== -1) return true;
    else return false;
  }


  addSelectedDatasetsList(template: any) {
    this.categoryLists[template.categoryName].used = this.categoryLists[template.categoryName].used + 1;
    this.dataSourceForDatasets.data.push(template);
    this.addedObj[template.categoryName + '-' + template.datasetName] = this.addComp(template);
    this.dataSourceForDatasets._updateChangeSubscription();
    this.dataSourceForDatasetsChange.emit(this.dataSourceForDatasets);
  }

  getcategoryList(searchKey: any) {
    return this.categoryList.filter(category => category.toLowerCase().includes(searchKey.toLowerCase()))
  }

  getDataSetList() {
    this.data_set_list = this.datasetList.filter((dataSet: any) => !this.dataSourceForDatasets.data.includes(dataSet) && this.selectedCategory === dataSet.categoryName);
    return this.data_set_list;
  }

}
