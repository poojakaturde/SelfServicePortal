import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  providers: [DatePipe]
})
export class ProjectsComponent implements OnInit {
  public showCards : boolean | undefined;
  displayedColumns = ['projectName', 'documentStructure', 'projectLead', 'startDate', 'endDate', 'updated'];
  dataSource: any = new MatTableDataSource([]);
  enabledProjList : any = new MatTableDataSource([]);
  projectManagementPermssion = {
    edit: true,
    changeStatus: true,
    create: true
  }
  docStructureIconMap = {
    'Structured': 'crop',
    'Semi-Structured' : 'list_alt',
    'Free-Form': 'gesture',
    'Medical Chart': 'assignment_ind'
  }
  isRecordLoaded: boolean = false;
  constructor(private datePipe:DatePipe) { }

  ngOnInit(): void {
  }

  toggleCardView(value:any) {
    this.showCards = value;
  }
  filterUserTableData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.data = this.dataSource.data.map((x:any) => {
      x.startDate = this.datePipe.transform(x.startDate, 'MM-dd-yyyy');
      x.endDate = this.datePipe.transform(x.endDate, 'MM-dd-yyyy');
      x.updated = this.datePipe.transform(x.updated, 'MM-dd-yyyy HH:mm:ss');
      return { ...x };
    })
    this.dataSource.filterPredicate = function(data:any, filter: any): any {
      return data.projectName.toLowerCase().includes(filter) || data.projectLead.toLowerCase().includes(filter) ||
      data.documentStructure.toLowerCase().includes(filter) || data.updated.toLowerCase().includes(filter) || 
      data.startDate.toLowerCase().includes(filter) || data.endDate.toLowerCase().includes(filter) ;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if(this.enabledProjList) {
      // return this.enabledProjList.filter(list => list.projectName.toLowerCase().includes(filterValue.toLowerCase()));
      this.enabledProjList.filterPredicate = function(data:any, filter: any): any {
        return data.projectName.toLowerCase().includes(filter) || data.projectLead.toLowerCase().includes(filter) ||
        JSON.stringify(data.total).toLowerCase().includes(filter) || JSON.stringify(data.processed).toLowerCase().includes(filter) || 
        JSON.stringify(data.ready).toLowerCase().includes(filter) || JSON.stringify(data.rejected).toLowerCase().includes(filter) ||
        JSON.stringify(data.totalValidationCount).toLowerCase().includes(filter) || data.totalValidationTime.toLowerCase().includes(filter);
      }
      this.enabledProjList.filter = filterValue.trim().toLowerCase();
    }
  }
}
