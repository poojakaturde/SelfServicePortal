import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Field, Row, Section, WidgetData } from '../dynamic-form.model';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';

@Component({
  selector: 'app-create-edit-dynamic-form',
  templateUrl: './create-edit-dynamic-form.component.html',
  styleUrls: ['./create-edit-dynamic-form.component.scss']
})
export class CreateEditDynamicFormComponent implements OnInit {

  form!: FormGroup;
  createdFormData: any;
  formList: any;
  validatorList: any;
  showForm = true;
  showPreview = false;
  formId: any;
  selectedFormData: any;
  isCreateDynamicFormOperation: boolean = true;

  controlTypeList: string[] = ['EDIT_TEXT', 'EDIT_TEXT_PHONE', 'DROPDOWN', 'DATE_PICKER', 'RADIO', 'AUTOCOMPLETE', 'CHECKBOX']

  constructor(private formbuilder: FormBuilder, private http: HttpClient, private apiRequest: RequestApiService, private snackbar: SnackbarService,
    private router: Router, private routes: ActivatedRoute, private authenticationService: AuthenticationService) {
    this.isCreateDynamicFormOperation = this.routes.snapshot.params['name'] ? false : true;
    this.createForm();
  }

  ngOnInit(): void {
    let permission = this.authenticationService.getPermissions();
    let permissions = Array.from(permission);
    if (permissions.includes('CREATE_DYNAMIC_FORM') || (permissions.includes('EDIT_DYNAMIC_FORM') && !this.isCreateDynamicFormOperation)) {
      this.fetchValidators();
      this.getAllForms();
      const formName = this.routes.snapshot.params['name'];
      if (formName) {
        this.apiRequest.getDynamicFormByName(formName)
          .subscribe((res: any) => {
            if (res && res.detail) {
              this.selectedFormData = res.detail;
              this.updateForm();
            }
          }, error => {
            this.snackbar.open('Error In getting Form Details', '', { type: 'warning' })
          })
      }
    } else {
      this.snackbar.open('User Does Not Have permission', '', { type: 'warning' });
      this.router.navigate(['./home/dynamic-form']);
    }
  }

  createForm() {
    this.form = this.formbuilder.group(
      {
        name: ['', Validators.required],
        eligibility: false,
        nextFormId: "",
        status: "enabled",
        sections: this.formbuilder.array([]),
      }
    );

  }

  updateForm() {

    var data = this.selectedFormData;

    data.sections.forEach((s: Section) => {

      var section = this.newSection();
      this.sections().push(section);

      s.rows.forEach((r: Row) => {
        var row = this.newRow();

        (section.get("rows") as FormArray).push(row)

        r.fields.forEach((c: Field) => {
          var child = this.newField();

          (row.get("fields") as FormArray).push(child)

          c.widgetData.forEach((w: WidgetData) => {
            (child.get("widgetData") as FormArray).push(this.newWidgetData())
          })
        })

      });
    });
    this.form.patchValue(data);
  }

  getAllForms() {
    this.apiRequest.getDynamicForms().subscribe((res: any) => {
      if (res && res.detail && res.detail.length) {
        this.formList = res.detail;

      }
    }, error => {
      this.snackbar.open('Failed To Fetch the Form List ...!', '', { type: 'warning' });
    })
  }

  fetchValidators() {
    this.apiRequest.getOperatorList().subscribe((res: any) => {
      if (res && res.detail && res.detail.length) {
        this.validatorList = res.detail;
      }
    }, error => {
      this.snackbar.open('Failed To Fetch the Validator List ...!', '', { type: 'warning' });
    })
  }

  sections(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  newSection(): FormGroup {
    return this.formbuilder.group({
      sectionTitle: "",
      rows: this.formbuilder.array([])

    });

  }

  addSection() {
    this.sections().push(this.newSection());
  }

  removeSection(sectionIndex: number) {
    this.sections().removeAt(sectionIndex);
  }


  rows(sectionIndex: number): FormArray {
    return this.sections()
      .at(sectionIndex)
      .get('rows') as FormArray;
  }

  newRow(): FormGroup {
    return this.formbuilder.group({
      rowTitle: "",
      fields: this.formbuilder.array([])
    });
  }

  addRow(sectionIndex: number) {
    this.rows(sectionIndex).push(this.newRow());
  }

  removeRow(sectionIndex: number, rowIndex: number) {
    this.rows(sectionIndex).removeAt(rowIndex);
  }

  fields(sectionIndex: number, rowIndex: number): FormArray {
    return this.rows(sectionIndex)
      .at(rowIndex)
      .get('fields') as FormArray;
  }

  newField(): FormGroup {
    return this.formbuilder.group({
      type: "",
      title: "",
      minLength: 0,
      maxLength: 0,
      validationType: null,
      required: false,
      row: false,
      childField: null,
      widgetData: this.formbuilder.array([]),
    });
  }

  addNewField(sectionIndex: number, rowIndex: number) {
    this.fields(sectionIndex, rowIndex).push(this.newField());
  }

  removeField(sectionIndex: number, rowIndex: number, fieldIndex: number) {
    this.fields(sectionIndex, rowIndex).removeAt(fieldIndex);
  }

  widgetData(sectionIndex: number, rowIndex: number, fieldIndex: number): FormArray {
    return this.fields(sectionIndex, rowIndex,)
      .at(fieldIndex)
      .get('widgetData') as FormArray;
  }

  newWidgetData(): FormGroup {
    return this.formbuilder.group({
      title: '',
      value: '',
      isSelected: false,
    });
  }

  addWidgetData(sectionIndex: number, rowIndex: number, childFieldIndex: number) {
    this.widgetData(sectionIndex, rowIndex, childFieldIndex).push(this.newWidgetData());
  }

  removeWidgetData(sectionIndex: number, rowIndex: number, childFieldIndex: number, widgetDataIndex: number) {
    this.widgetData(sectionIndex, rowIndex, childFieldIndex).removeAt(widgetDataIndex);
  }

  onSave() {
    this.createdFormData = this.form.value;

    if (this.form.status) {
      this.apiRequest.createUpdateDynamicForm(this.createdFormData, this.isCreateDynamicFormOperation)
        .subscribe(res => {
          if (res) {
            if (res.status === 'E') {
              this.router.navigate(['./home/dynamic-form'])
            } else if (res.status === 'S' && res.description) {
              this.snackbar.open(res.description, '', { type: 'warning' });
              this.router.navigate(['./home/dynamic-form'])
            }
          }
        }, error => {
          this.snackbar.open(`Failed to create Form`, '', { type: 'warning' });
        })
    } else {
      this.snackbar.open('Please fill all the details before submitting', '', { type: 'warning' });
    }
  }

  onPreview() {
    this.createdFormData = this.form.value;
    this.showForm = false;
    this.showPreview = true;
  }

  backToForm() {
    this.showForm = true;
    this.showPreview = false;
  }
}
