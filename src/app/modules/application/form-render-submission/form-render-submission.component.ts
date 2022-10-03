import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router'
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { SharedService } from 'src/app/core/services/shared-service/shared.service';
@Component({
  selector: 'app-render-form',
  templateUrl: './form-render-submission.component.html',
  styleUrls: ['./form-render-submission.component.scss'],

})
export class FormRenderSubmissionComponent implements OnInit {

  renderFormName: any;
  submitForm!: FormGroup;
  dynamicFormDetails: any;
  submittedFormData: any;
  result: any;
  dynamicFormId: any;
  dynamicFormList: any;
  selected: any[] = [];
  selectedChecks: any;
  getProjectName: any;
  username: any;

  constructor(private service: SharedService, private fb: FormBuilder, private apiRequest: RequestApiService, private snackbar: SnackbarService, private router: Router) { }

  ngOnInit(): void {
    this.renderFormName = this.service.getFormName();
    this.getProjectName = this.service.getProjectName();
    this.submitForm = this.fb.group({})
    this.renderForm();

    const UI = JSON.parse(localStorage.getItem('__UI')!);
    this.username = UI.userName;
  }

  // getAllDynamicForms() {
  //   this.apiRequest.getDynamicForms().subscribe(res => {
  //     this.dynamicFormList = res.detail;
  //   })
  // }

  renderForm() {
    this.apiRequest.renderFormByName(this.renderFormName).subscribe((res: any) => {
      if (res && res.detail) {
        this.dynamicFormDetails = res.detail;
        this.formControlCreationValidation();
      }
    }, error => {
      this.snackbar.open('Failed To Fetch the Form Data ...!', '', { type: 'warning' });
    })
  }

  formControlCreationValidation() {
    const group: any = {};
    for (var list of this.dynamicFormDetails.sections) {
      for (var l of list.rows) {
        for (var f of l.fields) {
          if (f.type == 'EDIT_TEXT') {
            if (f.required) {
              group[f.title] = new FormControl(f.title || '', [
                Validators.required, Validators.minLength(f.minLength), Validators.maxLength(f.maxLength), Validators.pattern(f.validationType.regex)
              ]);
            }
            else {
              group[f.title] = new FormControl();
            }
          } else if (f.type == 'EDIT_TEXT_PHONE') {
            if (f.required) {
              group[f.title] = new FormControl(f.title || '', [
                Validators.required, Validators.minLength(f.minLength), Validators.maxLength(f.maxLength), Validators.pattern(f.validationType.regex)
              ]);
            }
            else {
              group[f.title] = new FormControl();
            }
          } else if (f.type == 'AUTOCOMPLETE') {
            if (f.required) {
              group[f.title] = new FormControl(f.title || '', [
                Validators.required, Validators.pattern(f.validationType.regex)
              ]);
            }
            else {
              group[f.title] = new FormControl();
            }
          } else if (f.type == 'DROPDOWN') {
            if (f.required) {
              group[f.title] = new FormControl(f.title || '', [
                Validators.required, Validators.pattern(f.validationType.regex)
              ]);
            }
            else {
              group[f.title] = new FormControl();
            }
          } else if (f.type == 'RADIO') {
            if (f.required) {
              group[f.title] = new FormControl(false, [
                Validators.required
              ]);
            }
            else {
              group[f.title] = new FormControl(false);
            }
          } else if (f.type == 'DATE_PICKER') {
            if (f.required) {
              group[f.title] = new FormControl(f.title || '', [
                Validators.required
              ]);
            }
            else {
              group[f.title] = new FormControl();
            }
          } else if (f.type == 'CHECKBOX') {
            if (f.required) {
              group[f.title] = new FormControl(Validators.required);
            }
            else {
              group[f.title] = new FormControl();
            }
          }
        }
      }
    }
    this.submitForm = new FormGroup(group);
  }

  onSubmit() {
    this.submittedFormData = this.submitForm.value;
    if (this.submitForm.status) {
      this.validateForm();
      this.submitFormData();
    }
  }

  validateForm() {
    let dataItem = new Map<string, string>();
    let dataMap = new Map<string, Map<string, string>>();
    for (var list of this.dynamicFormDetails.sections) {
      dataItem = new Map<string, string>();
      for (var row of list.rows) {
        for (var fields of row.fields) {
          dataItem.set(fields.title, this.submittedFormData[fields.title])
        }
      }
      dataMap.set(list.sectionTitle, dataItem)
      this.result = dataMap;
    }
  }

  submitFormData() {
    const sectionChildMap: any = {};
    var childItem: any = {};
    let keys = Array.from(this.result.keys())
    for (var key of keys) {
      var name = String(key)
      var Temp = this.result.get(key);
      childItem = {};
      Temp.forEach((val: string, key: string) => {
        childItem[key] = val;
      })
      sectionChildMap[name] = childItem;
    }

    // for (var form of this.dynamicFormList) {
    //   if (form.name == this.renderFormName) {
    //     this.dynamicFormId = form.id;
    //   }
    // }

    this.apiRequest.submitUserForm(this.renderFormName, sectionChildMap, this.getProjectName, this.username).subscribe(res => {
      console.log(res)
      if (res) {
        if (res.status === 'E') {
          this.router.navigate(['./home/application'])
        }
        else if (res.status === 'S' && res.description) {
          this.snackbar.open(res.description, '', { type: 'warning' });
        }
      }
    }, error => {
      this.snackbar.open('failed to submit form', '', { type: 'warning' });
    })
  }

  onCheckboxChange(event: any) {

    for (var list of this.dynamicFormDetails.sections) {
      for (var l of list.rows) {
        for (var f of l.fields) {
          if (f.type == "CHECKBOX") {
            if (event.source.checked) {
              this.selected.push(event.source.value);
            } else if (event.source.checked == false) {
              this.selected.splice(this.selected.indexOf(event.source.value), 1)
            }
            this.selectedChecks = this.selected.join(',');
            this.submitForm.controls[f.title].setValue(this.selectedChecks)
          }
        }
      }
    }
  }

}

