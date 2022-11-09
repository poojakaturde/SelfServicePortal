import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent implements OnInit {

  @Input() projectInfoForm: any;
  @Input() isProjectReadOnly: any;
  @Input() projectErrorMsg: any;
  @Input() userList: any[] = [];
  @Input() dataSource: any;
  @Input() straightThroughScore: any;
  @Input() attributeList: any;
  @Input() attrListForSemiStructure: any;
  @Input() attributeListChange: any;
  @Input() columnHeadersForInmar: any;
  @Input() attrListForInmarReturns: any;
  @Input() headerListForInmar: any;
  @Input() attributeListRCM: any;
  @Input() testedSourceData: any;
  @Input() minDate: any;
  @Output() projectInfoFormChange: EventEmitter<any> = new EventEmitter();
  @Output() straightThroughScoreChange: EventEmitter<any> = new EventEmitter();
  @Output() setStep: EventEmitter<any> = new EventEmitter();
  @Output() dataSourceChange: EventEmitter<any> = new EventEmitter();
  @Output() isSourceDataChange: EventEmitter<any> = new EventEmitter();
  @Output() columnHeadersForInmarChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }
  projectstartDate: any;
  docTypeList = ['Structured', 'Semi-Structured', 'Free-Form', 'Medical Chart'];
  ngOnInit(): void {
    this.projectstartDate = this.projectInfoForm.valueChanges.subscribe((res: any) => {
      if (res.startDate) {
        this.minDate = new Date(res.startDate);
      }
    });
  }

  //Project info section
  onDocumentStructureChange() {
    setTimeout(() => {
      if (this.projectInfoForm.value.documentStructure === 'Structured') {
        this.projectInfoForm.patchValue({
          processingEngine: null
        })
        this.setStep.emit(1);
      } else if (this.projectInfoForm.value.documentStructure === 'Semi-Structured') {
        let data = this.projectInfoForm.value.documentStructure === 'Free-Form' ? [] : this.attrListForSemiStructure;
        let attributes: any[] = [];
        this.attrListForSemiStructure.forEach((attr: any) => {
          let index = data.findIndex((x: any) => x.name == attr.name);
          index >= 0 ? attributes.push(data[index]) : attributes.push(attr);
        });
        this.attrListForSemiStructure = [...attributes];
        this.dataSource.data = [...data];
        this.projectInfoForm.patchValue({
          processingEngine: null
        })
        this.setStep.emit(2);
      } else if (this.projectInfoForm.value.documentStructure === 'Free-Form') {
        this.dataSource.data = this.projectInfoForm.value.documentStructure === 'Free-Form' ? [] : JSON.parse(JSON.stringify(this.attributeList));
        this.projectInfoForm.patchValue({
          processingEngine: null
        })
        this.setStep.emit(2);
      } else {
        this.dataSource.data = this.projectInfoForm.value.documentStructure === 'Medical Chart' ? [] : JSON.parse(JSON.stringify(this.attributeListRCM));
        this.projectInfoForm.patchValue({
          processingEngine: null
        })
        this.setStep.emit(3);
      }
    }, 0)
    this.dataSourceChange.emit(this.dataSource);
    this.projectInfoFormChange.emit(this.projectInfoForm);
  }

  addRemoveScoreCtrol() {
    if (this.projectInfoForm.value.staightThroughProcessing) {
      this.projectInfoForm.controls['score'].setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      this.projectInfoForm.patchValue({
        score: this.straightThroughScore
      })
    } else {
      this.projectInfoForm.controls['score'].setValidators([Validators.min(0), Validators.max(100)]);
      this.straightThroughScore = this.projectInfoForm.value.score;
      this.straightThroughScoreChange.emit(this.straightThroughScore)
      this.projectInfoForm.patchValue({
        score: 0
      })
    }
    this.projectInfoForm.controls['score'].updateValueAndValidity();
    this.projectInfoFormChange.emit(this.projectInfoForm);
  }

  setDocumentScore(val: any) {

    if (val.value.length > 1) {
      val = val.value.replace(/^0+/, '')
      if (val < 0) {
        this.projectInfoForm.patchValue({ score: 0 })
      }
      else if (val <= 100) {
        this.projectInfoForm.patchValue({ score: val })
      }
      else {
        this.projectInfoForm.patchValue({ score: 100 })
      }
    }
    this.projectInfoFormChange.emit(this.projectInfoForm);
  }

  getuserList(searchKey: any) {
    return this.userList.filter(userName => userName.toLowerCase().includes(searchKey.toLowerCase()))
  }

  trim(name: any) {
    this.projectInfoForm.patchValue({
      project: this.rem(name)
    })
    this.projectInfoFormChange.emit(this.projectInfoForm);
  }

  rem(j: any) {

    return j.value?.
      replace(/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
      replace(/[ ]{2,}/gi, " "). // replaces multiple spaces with one space 
      replace(/\n +/, "\n")
  }

  sourceDataChanged(value: any, fieldname: any) {
    if (value.value !== this.testedSourceData[fieldname]) {
      this.isSourceDataChange.emit(true);
    } else {
      this.isSourceDataChange.emit(false);
    }
  }

  ngOnDestroy(): void {
    if (this.projectstartDate) {
      this.projectstartDate.unsubscribe();
    }
  }
}
