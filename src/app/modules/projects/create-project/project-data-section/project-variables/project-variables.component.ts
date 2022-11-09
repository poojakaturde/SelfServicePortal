import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';

@Component({
  selector: 'app-project-variables',
  templateUrl: './project-variables.component.html',
  styleUrls: ['./project-variables.component.scss']
})
export class ProjectVariablesComponent implements OnInit {

  @Input() dataSourceForVariables: any;
  @Input() operatorListByValidation: any;
  @Input() step: any;
  @Output() setStep: EventEmitter<any> = new EventEmitter();
  @Output() dataSourceForVariablesChange: EventEmitter<any> = new EventEmitter();
  constructor(private snackbar: SnackbarService) { }

  displayedColumnsForTestVariable: string[] = ['attributeName', 'dataType', 'validation', 'action'];

  ngOnInit(): void {
  }
  variablesForm = {
    name: '',
    validationType: '',
    value: ''
  }

  setfocus() {
    this.variablesForm = {
      name: '',
      validationType: '',
      value: ''
    }
    setTimeout(() => {
      document.getElementById('variableName')!.focus();
    }, 300);
  }

  deleteVariable(i: any) {
    this.dataSourceForVariables.data.splice(i, 1);
    this.dataSourceForVariables._updateChangeSubscription();
    this.dataSourceForVariablesChange.emit(this.dataSourceForVariables);
  }

  addVariable(variable: any) {
    let index = this.dataSourceForVariables.data.findIndex((x: any) => x.name === variable.name)
    if (index > -1) {
      this.snackbar.open('Duplicate Variable name not allowed.', '', { type: 'warning' })
      return false;
    }
    let obj: any;
    if (variable.name) {
      obj = {
        "name": variable.name.trim(),
        "validationType": variable.validationType,
        "value": variable.value
      }
    } else {
      obj = {
        "name": variable.name.trim(),
        "validationType": variable.validationType,
        "value": variable.value
      }
    }

    this.dataSourceForVariables.data.push(obj);
    this.dataSourceForVariables._updateChangeSubscription();
    this.dataSourceForVariablesChange.emit(this.dataSourceForVariables);
    this.variablesForm = {
      name: '',
      validationType: '',
      value: ''
    }
    document.getElementById('variableName')!.focus() ;
    return true;
  }

}
