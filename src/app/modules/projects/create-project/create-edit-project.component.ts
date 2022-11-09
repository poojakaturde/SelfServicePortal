import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { ReateProjectInternalCommunicationServiceService } from 'src/app/core/services/reate-project-internal-communication-service.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-create-project',
  templateUrl: './create-edit-project.component.html',
  styleUrls: ['./create-edit-project.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreateEditProjectComponent implements OnInit {
  projectInfoForm !: FormGroup;

  datasetList: any = [];
  dataSourceForTargetChannel: any = new MatTableDataSource([]);
  BREVariable: any = [];

  SourceChannelResponse: any = {};
  isDatasetEnabled: any = false;
  datasetdata: any = [];
  dynamicProjectList: any = [];
  docTypeList = ['Structured', 'Semi-Structured', 'Free-Form', 'Medical Chart'];
  isProjectReadOnly: boolean = false;
  isProjectCmpleted: boolean = false;
  folderId: any = null;
  drlAttributeList: any = [];
  templateAttributeList: any = []

  attrListForInmarReturns: any[] = []
  isEmailvalid: boolean = true;

  attributeListChange: any = [];
  dataSourceForApi: any = new MatTableDataSource([]);
  SystemVariables: any = {};
  attributeList: any[] = [];
  dataSourceForVariables: any = new MatTableDataSource([]);
  fileIndex: any;
  dataSourceForDatasets: any = new MatTableDataSource([]);
  addedObj: any = {};
  categoryList: any = [];
  templateList: any[] = [];
  projectErrorMsg: any = "";
  isMandatoryHeader: boolean = false;
  headerListForInmar: any = [];
  straightThroughScore: number = 0;

  selfServiceFormMsg: any = "";
  sourceChanelForm1!: FormGroup;
  columnHeadersForInmarType: any[] = []
  columnHeadersForInmar: any = new MatTableDataSource(this.columnHeadersForInmarType);
  categoryLists: any = {}
  dataSourceForTemplates: any = new MatTableDataSource([]);
  roleWithDetailList: any = [];
  isSourceVerified: boolean = false;
  operatorListByValidation: any = {};
  roleList: any = [];
  userList: any = [];
  testedSourceData: any = {};
  sourceList: any = {}
  treeObj: any = [];

  datastHeaderList: any = {};
  listForSemiStruct = ['Trade', 'Returns'];
  minDate = new Date;
  selectedRoles: any = [];
  attributeListRCM: any[] = [];
  attrListForSemiStructure: any[] = []
  previousData: any = null;
  processingEngineAttributes: any[] = [];
  dataSource: any = new MatTableDataSource([]);
  step: any = 0;
  panelOpenState = false;
  listForStruct: any[] = ['NN High', 'NN Low', 'Brute Force'];
  selectedProjectInfo: any = {
    id: '',
    created: '',
    endDate: '',
    lead: '',
    project: '',
    roles: [],
    startDate: '',
    status: '',
    updated: ''
  };
  Stepper: any[] = [
    {
      status: 'current'
    },
    {
      status: ''
    },
    {
      status: ''
    }
  ]
  isSourceDataChange: boolean = false;
  SourceChannelfilename: any = '';
  drldata: any = [];
  isCreateProjectOperation: boolean = true;
  constructor(private apiRequest: RequestApiService, private snackbar: SnackbarService,
    private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService,
    private routes: ActivatedRoute, private cpicomm: ReateProjectInternalCommunicationServiceService) { }

  ngOnInit(): void {
    let permissions = this.authenticationService.getPermissions();
    if (permissions.includes('CREATE_PROJECT') || (permissions.includes('UPDATE_PROJECT') && !this.isCreateProjectOperation)) {
      this.dynamicFormList();
      this.createForm();
      this.fetchCreatedUsersAndRoles()
      const id = this.routes.snapshot.params['id'];

      if (id) {
        this.projectInfoForm.addControl('created', new FormControl({ value: '', disabled: true }));
        this.projectInfoForm.addControl('updated', new FormControl({ value: '', disabled: true }));
        this.isCreateProjectOperation = false;
        forkJoin(this.apiRequest.getProjectDetails(id), this.apiRequest.getDatsetList())
          .subscribe((resp: any) => {
            let res: any = resp[0];
            if (res && res.detail) {
              this.selectedProjectInfo = res.detail;
              this.selectedProjectInfo.roles = this.selectedProjectInfo.roles.map((r: any) => {
                r.isEnabled = r.status === "enabled" ? true : false;
                this.selectedRoles.push(r.role);
                return { ...r }
              });
              this.previousData = res.detail;
              this.straightThroughScore = res.detail.score || 0;
              this.processingEngineAttributes = res.detail.documentStructure === 'Semi-Structured' ? this.listForSemiStruct : this.listForStruct;
              //getting template data
              // this.onDocumentStructureChange();
              if (res.detail.documentStructure === "Structured") {
                this.dataSourceForTemplates.data = res.detail.templates || [];
                if (this.dataSourceForTemplates.data.length) {
                  this.setTemplateList();
                }
              }

              //getting Project Information data
              this.projectInfoForm.patchValue({
                project: res.detail.project,
                lead: res.detail.lead,
                status: res.detail.status === 'enabled' ? true : false,
                auditRequired: res.detail.auditRequired,
                isSelfServiceEnabled: res.detail.isSelfServiceEnabled,
                selfServiceForm: res.detail.selfServiceForm,
                autoAssignment: res.detail.autoAssignment || false,
                startDate: new Date(res.detail.startDate),
                endDate: new Date(res.detail.endDate),
                created: res.detail.created,
                updated: res.detail.updated,
                // created: this.sharedService.convertUTCDateToLocalDate(new Date(res.detail.created)).toLocaleString(),
                // updated: this.sharedService.convertUTCDateToLocalDate(new Date(res.detail.updated)).toLocaleString(),
                documentStructure: res.detail.documentStructure,
                staightThroughProcessing: res.detail.staightThroughProcessing,
                processingEngine: res.detail.processingEngine,
                score: res.detail.score
              });

              //getting Attribute List
              if (res.detail.attributes && res.detail.attributes.length) {
                if (res.detail.documentStructure === 'Free-Form') {
                  let attributes: any = [];
                  let mandatoryFieldCount = 0;
                  this.attributeList.forEach((attr: any) => {
                    let index = res.detail.attributes.findIndex((a: any) => a.name === attr.name);
                    if (index >= 0) {
                      attributes.push(res.detail.attributes[index]);
                      mandatoryFieldCount++;
                    } else {
                      attributes.push(attr);
                    }
                  });
                  this.attributeList = [...attributes];
                  this.dataSource.data = [...res.detail.attributes];
                  this.isMandatoryHeader = this.dataSource.data.length && mandatoryFieldCount === this.dataSource.data.length ? true : false;
                  this.dataSource._updateChangeSubscription();
                }
                else if (res.detail.documentStructure === 'Semi-Structured') {

                  if (res.detail.processingEngine === 'Returns') {
                    let attributes: any = [];
                    let mandatoryFieldCount = 0;
                    this.attrListForInmarReturns.forEach(attr => {
                      let index = res.detail.attributes.findIndex((x: any) => x.name == attr.name);
                      if (index >= 0) {
                        attributes.push(res.detail.attributes[index]);
                        mandatoryFieldCount++;
                      } else {
                        attributes.push(attr);
                      }
                    });
                    this.attributeListChange = [...attributes];
                    this.dataSource.data = [...res.detail.attributes];
                    this.isMandatoryHeader = this.dataSource.data.length && mandatoryFieldCount === this.dataSource.data.length ? true : false;
                    this.dataSource._updateChangeSubscription();
                  }
                  else {
                    let attributes: any = [];
                    let mandatoryFieldCount = 0;
                    this.attrListForSemiStructure.forEach(attr => {
                      let index = res.detail.attributes.findIndex((x: any) => x.name == attr.name);
                      if (index >= 0) {
                        attributes.push(res.detail.attributes[index]);
                        mandatoryFieldCount++;
                      } else {
                        attributes.push(attr);
                      }
                    });
                    this.attributeListChange = [...attributes];
                    this.dataSource.data = [...res.detail.attributes];
                    this.isMandatoryHeader = this.dataSource.data.length && mandatoryFieldCount === this.dataSource.data.length ? true : false;
                    this.dataSource._updateChangeSubscription();
                  }
                }
                else if (res.detail.documentStructure === 'Medical Chart') {
                  let attributes: any = [];
                  this.attributeListRCM.forEach((attr: any) => {
                    let index = res.detail.attributes.findIndex((x: any) => x.name == attr.name);
                    index >= 0 ? attributes.push(res.detail.attributes[index]) : attributes.push(attr);
                  });
                  this.attributeListRCM = [...attributes];
                  this.dataSource.data = [...res.detail.attributes];
                  this.dataSource._updateChangeSubscription();
                }

              }

              //Getting Table Details
              // if(res.detail.tableAttributes && res.detail.tableAttributes.length) {
              if (res.detail.processingEngine === 'Returns') {
                let tableAttributes: any = [];
                this.columnHeadersForInmarType.forEach(attr => {
                  let index = res.detail.tableAttributes.findIndex((a: any) => a.name === attr.name);
                  index >= 0 ? tableAttributes.push(res.detail.tableAttributes[index]) : tableAttributes.push(attr);
                });
                this.headerListForInmar = [...tableAttributes];
                this.columnHeadersForInmar.data = [...res.detail.tableAttributes];
                this.columnHeadersForInmar._updateChangeSubscription();
              }
              // }

              //Getting Datasets
              if (res && res.detail && res.detail.datasets && res.detail.datasets.length) {
                this.datasetdata = res.detail.datasets;
              }
              if (resp[1] && resp[1].detail && resp[1].detail.length) {
                this.getDatasetData(resp[1]);
              }

              //Getting Api's
              if (res && res.detail && res.detail.apiConfig && res.detail.apiConfig.length) {
                this.dataSourceForApi.data = res.detail.apiConfig.map((dt_api: any) => {
                  dt_api.isEnabled = dt_api.status === 'enabled' ? true : false;
                  return dt_api;
                });
              }

              //Getting targetChannel's
              if (res && res.detail && res.detail.targetChannels && res.detail.targetChannels.length) {
                this.dataSourceForTargetChannel.data = res.detail.targetChannels.map((channel: any) => {
                  channel.isEnabled = channel.status === 'enabled' ? true : false;
                  return channel;
                });
              }

              //getSourceData
              if (res && res.detail && res.detail.sourceChannel) {
                this.cpicomm.UpdateSourcData(res.detail.sourceChannel);
                this.SourceChannelResponse = res.detail.sourceChannel
                this.folderId = res.detail.sourceChannel.folderId;
              }

              //  Getting breVariables
              if (res && res.detail && res.detail.breVariables && res.detail.breVariables.length) {
                this.dataSourceForVariables.data = res.detail.breVariables;
                this.dataSourceForVariables._updateChangeSubscription();
              }

              //  Getting flowVariables
              if (res && res.detail && res.detail.breFlowVariables) {
                this.SystemVariables = res.detail.breFlowVariables;
              }

              //getting Rule Engine Data
              if (res.detail.drlJson) {
                let drlrule1: any = JSON.parse(res.detail.drlJson);
                if (drlrule1.Structure && drlrule1.Structure.length) {
                  this.treeObj = drlrule1.Structure;
                  this.treeObj.forEach((ruleset: any) => {
                    if (ruleset.collapse) {
                      ruleset.collapse = false;
                    } else {
                      ruleset['collapse'] = false;
                    }
                  });
                }
                if (drlrule1.ruleSets && drlrule1.ruleSets.length) {
                  this.drldata = drlrule1.ruleSets;
                  if (!this.drldata[0].rules) {
                    this.drldata = [];
                    this.treeObj = [];
                  }
                }

              }
            }
          }, error => {
            this.snackbar.open('Error In getting User Details', '', { type: 'warning' })
          })
      } else {
        forkJoin(this.apiRequest.getDatsetList()).subscribe(
          (res: any) => {
            if (res[0] && res[0].detail && res[0].detail.length) {
              this.getDatasetData(res[0]);
            }

          }, error => {
            this.snackbar.open('Error In getting dataset Details', '', { type: 'warning' })
          }
        )
      }
    } else {
      this.snackbar.open('User Does Not Have permission', '', { type: 'warning' });
      this.router.navigate(['./home/project-management']);
    }


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
  }

  getDatasetData(res: any) {
    if (res && res.detail && res.detail.length) {
      this.datasetList = res.detail;
      if (this.datasetdata.length) {
        this.dataSourceForDatasets.data = [];
        this.datasetdata.forEach((dataset: any) => {
          let index = this.datasetList.findIndex((data: any) => data.datasetId === dataset.datasetId);
          if (index >= 0) {
            this.datasetList[index].status = dataset.status;
            this.dataSourceForDatasets.data.push(this.datasetList[index]);
            this.addedObj[this.datasetList[index].categoryName + '-' + this.datasetList[index].datasetName] = true;
          }
        });
        this.dataSourceForDatasets._updateChangeSubscription();
      }
      this.datasetList.forEach((dataset: any) => {
        if (!this.categoryList.includes(dataset.categoryName)) {
          this.categoryList.push(dataset.categoryName)
        }
        if (this.categoryLists[dataset.categoryName]) {
          this.categoryLists[dataset.categoryName].present = this.categoryLists[dataset.categoryName].present + 1;
          if (this.dataSourceForDatasets.data.some((x: any) => x.categoryName === dataset.categoryName && x.datasetName === dataset.datasetName)) {
            this.categoryLists[dataset.categoryName].used = this.categoryLists[dataset.categoryName].used + 1
          }
        } else {
          this.categoryLists[dataset.categoryName] = { present: 1, used: 0 }
          if (this.dataSourceForDatasets.data.some((x: any) => x.categoryName === dataset.categoryName && x.datasetName === dataset.datasetName)) {
            this.categoryLists[dataset.categoryName].used = this.categoryLists[dataset.categoryName].used + 1
          }
        }
      });
    }
  }

  setTemplateList() {
    let templateList: any = [];
    this.templateList.forEach(temp => {
      let index = this.dataSourceForTemplates.data.findIndex((x: any) => x.id == temp.id);
      index >= 0 ? templateList.push(this.dataSourceForTemplates.data[index]) : templateList.push({ ...temp, status: 'enabled' });
    });
    this.templateList = [...templateList];
  }

  fetchCreatedUsersAndRoles() {
    forkJoin(this.apiRequest.fetchRolesByStatus('enabled'), this.apiRequest.getUsersByStatus('enabled'), this.apiRequest.getTemplatesList())
      .subscribe((res: any) => {
        if (res && res.length) {
          this.roleWithDetailList = res[0].detail;
          this.roleList = res[0].detail.map((r: any) => r.role);
          this.userList = res[1].detail.map((user: any) => user.email);
          if (res[2] && res[2].detail && res[2].detail.length) {
            this.templateList = res[2].detail || [];
            if (this.templateList.length) {
              this.setTemplateList()
            }
          }
        }
      }, error => {
        this.snackbar.open('Something went wrong ...!', '', { type: 'warning' });
      })
  }

  createForm() {
    this.projectInfoForm = this.formBuilder.group({
      project: new FormControl({ value: '', disabled: !this.isCreateProjectOperation }, Validators.compose([
        Validators.required, Validators.pattern('^([a-zA-Z0-9\\s])+([a-zA-Z0-9\\s()]+)*(-[\(\)a-zA-Z0-9\\s]+)*$'), Validators.minLength(3), Validators.maxLength(75)
      ])),
      lead: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      status: new FormControl(''),
      autoAssignment: new FormControl(false),
      documentStructure: new FormControl({ value: '', disabled: !this.isCreateProjectOperation }, [Validators.required]),
      staightThroughProcessing: new FormControl(false),
      processingEngine: new FormControl(''),
      score: new FormControl(null, [Validators.min(0), Validators.max(100)]),
      auditRequired: new FormControl(''),
      isSelfServiceEnabled: new FormControl(''),
      selfServiceForm: new FormControl('')
    });

    this.projectInfoForm.valueChanges.subscribe(res => {
      this.minDate = new Date(res.startDate);
      this.validateProjectInfoForm();
    });
  }

  setStep(index: any) {
    this.step = index;
  }

  validateProjectInfoForm() {
    if (this.projectInfoForm.controls['project'].errors) {
      if (this.projectInfoForm.controls['project'].hasError('required'))
        this.projectErrorMsg = 'Please enter the project name.';
      else if (this.projectInfoForm.controls['project'].hasError('required')) {
        if (this.projectInfoForm.controls['project'].value.charAt(0) === '-' || this.projectInfoForm.controls['project'].value.charAt(0) === '(' || this.projectInfoForm.controls['project'].value.charAt(0) === ')') {
          this.projectErrorMsg = "Parenthesis and hyphens are not allowed at the beginning of a project name."
        } else if (this.projectInfoForm.controls['project'].value.slice(-1) === '-') {
          this.projectErrorMsg = "Hyphens are not allowed at the ending of a project name."
        }
        else {
          this.projectErrorMsg = 'Only alphabets, digits, and special characters - ( ) are allowed';
        }
      }

      else if (this.projectInfoForm.controls['project'].hasError('minlength'))
        this.projectErrorMsg = 'At least ' + this.projectInfoForm.controls['project'].hasError('minlength') + ' characters';
      else if (this.projectInfoForm.controls['project'].hasError('maxlength'))
        this.projectErrorMsg = 'At max ' + this.projectInfoForm.controls['project'].hasError('maxlength') + ' characters';
    }
  }

  validateCreateUpdateOperation() {
    if (this.projectInfoForm.controls['documentStructure'].value === 'Structured') {
      if (this.dataSourceForTemplates.data.length < 1) {
        return {
          msg: 'Please add the template before creating the project.',
          status: false
        };
      }
    }
    else {
      if (this.dataSource.data.length < 1) {
        return {
          msg: this.projectInfoForm.controls['documentStructure'].value === "Medical Chart" ? 'Please add the entities before creating the project.' : 'Please add the attributes before creating the project.',
          status: false
        };
      }
    }

    if (!this.projectInfoForm.valid && !this.selectedProjectInfo.roles.length) {
      return {
        msg: 'Please check form data and role(s) cannot be empty',
        status: false
      };
    } else if (!this.projectInfoForm.valid && this.selectedProjectInfo.roles.length) {
      return {
        msg: 'Please check form data',
        status: false
      };
    } else if (this.projectInfoForm.valid && !this.selectedProjectInfo.roles.length) {
      return {
        msg: 'Role(s) cannot be empty',
        status: false
      };
    } else {
      let isRoleValid: boolean = true;
      let msg = '';
      this.selectedProjectInfo.roles.forEach((role: any) => {
        if (!role.users.length && role.isEnabled) {
          isRoleValid = false;
          msg = 'Role cannot have empty users'
        }
      });
      return {
        msg: msg,
        status: isRoleValid
      }
    }
  }

  createEditProject() {
    if (this.projectInfoForm.controls['project'].errors && this.projectInfoForm.controls['project'].hasError('required')) {
      this.projectErrorMsg = 'Please enter the project name.';
    }
    let sourceData = this.getSourceValue();
    let isOperationValid = this.validateCreateUpdateOperation();
    if (this.validateDRLData() && this.testSourceValidaty()) {
      if (isOperationValid.status) {
        this.selectedProjectInfo.roles = this.selectedProjectInfo.roles.map((r: any) => {
          r.status = r.isEnabled ? 'enabled' : 'disabled';
          return { ...r };
        });

        let attr: any = {};
        if (this.projectInfoForm.controls['documentStructure'].value === 'Free-Form' || this.projectInfoForm.controls['documentStructure'].value === 'Semi-Structured' || this.projectInfoForm.controls['documentStructure'].value === 'Medical Chart') {
          attr = {
            attributes: this.projectInfoForm.controls['documentStructure'].value != 'Medical Chart' ? [...this.dataSource.data] : this.dataSource.data.map((entity: any) => {
              entity.name = entity.name.split(' ').join('');
              return entity;
            })

          }
        } else {
          if (this.dataSourceForTemplates.data.length) {
            attr['templates'] = this.dataSourceForTemplates.data.map((tmp: any) => {
              return { id: tmp.id, template: tmp.name, status: tmp.status };
            });
          }
        }
        let drlJson: any = "";
        if (this.drldata && this.drldata.length) {
          drlJson = {};
          drlJson['Structure'] = this.treeObj;
          drlJson['ruleSets'] = this.drldata;
          drlJson = JSON.stringify(drlJson);
        }
        if (this.SourceChannelfilename !== '' && this.fileIndex) {
          sourceData.details[this.fileIndex].value = this.SourceChannelfilename;
        }

        const reqObj = {
          ...this.selectedProjectInfo,
          project: this.projectInfoForm.controls['project'].value,
          lead: this.projectInfoForm.value.lead,
          startDate: this.formatDate(this.projectInfoForm.value.startDate),
          endDate: this.formatDate(this.projectInfoForm.value.endDate),
          status: this.projectInfoForm.value.status ? 'enabled' : 'disabled',
          auditRequired: this.projectInfoForm.value.auditRequired ? true : false,
          isSelfServiceEnabled: this.projectInfoForm.value.isSelfServiceEnabled ? true : false,
          selfServiceForm: this.projectInfoForm.value.selfServiceForm,
          autoAssignment: this.projectInfoForm.value.autoAssignment,
          documentStructure: this.projectInfoForm.controls['documentStructure'].value,
          staightThroughProcessing: this.projectInfoForm.value.staightThroughProcessing,
          sourceChannel: sourceData,
          drlJson: drlJson,
          flowVariables: this.BREVariable,
          breFlowVariables: this.SystemVariables,
          breVariables: this.dataSourceForVariables.data || [],
          datasets: this.dataSourceForDatasets.data || [],
          apiConfig: this.dataSourceForApi.data || [],
          targetChannels: this.dataSourceForTargetChannel.data || [],
          score: this.projectInfoForm.value.staightThroughProcessing ? this.projectInfoForm.value.score : null,
          processingEngine: this.projectInfoForm.controls['documentStructure'].value === 'Structured' || this.projectInfoForm.controls['documentStructure'].value === 'Semi-Structured' ? this.projectInfoForm.value.processingEngine : null,
          ...attr,
          tableAttributes: this.projectInfoForm.controls['processingEngine'].value === 'Returns' ? this.columnHeadersForInmar.data : [],
        }

        // debugger;
        this.apiRequest.createUpdateProject(reqObj, this.isCreateProjectOperation)
          .subscribe((res: any) => {
            if (res) {
              //  this.snackbar.open(res.description, '', { type: 'success' });
              if (res.status === 'S') {
                this.router.navigate(['./home/projects'])
              } else if (res.status === 'E' && res.description) {
                this.snackbar.open(res.description, '', { type: 'warning' });
              }
            }
          }, (error: any) => {
            this.snackbar.open(`Failed to ${this.isCreateProjectOperation ? 'Create' : 'Update'} Project`, '', { type: 'warning' });
          })
      } else {
        this.snackbar.open(isOperationValid.msg, '', { type: 'warning' });
      }
    }
  }

  dynamicFormList() {
    this.apiRequest.getDynamicFormList().subscribe(
      (res: any) => {
        if (res && res.detail && res.detail.length) {
          let activeProj: any = [];
          res.detail = res.detail.map((x: any) => {
            if (x && x.name) {
              activeProj.push(x.name);
            }
          })
          this.dynamicProjectList = [...activeProj];
        }
        else this.dynamicProjectList = [];
      }, error => {
        this.snackbar.open('Something went wrong ..!', '', { type: 'warning' });
      }
    )
  }


  validateDRLData() {
    let ruleNames: any = [];
    for (let l = 0; l < this.drldata.length; l++) {
      const ruleset: any = this.drldata[l];
      if (!ruleset.ruleset) {
        this.snackbar.open("Please enter a rule name", '', { type: 'warning' })
        return false;
      } else if (!(/^([a-zA-Z0-9 -]+)$/.test(ruleset.ruleset))) {
        this.snackbar.open("Please enter a valid name for" + ruleset.ruleset, '', { type: 'warning' })
        return false;
      }
      for (let i = 0; i < ruleset.rules.length; i++) {
        const rule = ruleset.rules[i];
        if (rule.type === 'BLOCK') {
          this.snackbar.open("Please enter atleast one condition or action for the rule" + rule.rule + "in" + ruleset.ruleset + ".", '', { type: 'warning' })
          return false;
        } else if (!rule.rule) {

          this.snackbar.open("Please enter atleast one condition or action for the rule" + rule.rule + "in" + ruleset.ruleset + ".", '', { type: 'warning' })
          return false;
        } else if (!(/^([a-zA-Z0-9 -]+)$/.test(rule.rule))) {
          this.snackbar.open("Please enter a valid name for condition or action for the rule" + rule.rule + ".", '', { type: 'warning' })
          return false;
        } else if (rule.rule && ruleNames.includes(rule.rule.trim())) {
          this.snackbar.open("Please do not enter a duplicate condition of action name for" + rule.rule + ".", '', { type: 'warning' })
          return false;
        } else if (rule.when) {

          for (let j = 0; j < rule.when.length; j++) {
            const line = rule.when[j];
            for (let k = 0; k < line.conditions.length; k++) {
              const condition = line.conditions[k];
              if (condition.attribute === '' || condition.operator === '') {
                if (condition.entity !== "HCCConditions") {
                  this.snackbar.open("Please enter a valid condition in " + rule.rule + ".", '', { type: 'warning' })
                  return false;
                }
              } else if (condition.operator === '$regex') {
                if (!condition.isValidRegex) {
                  this.snackbar.open("Please enter a valid Regular Expression in condition -" + rule.rule + ".", '', { type: 'warning' })
                  return false;
                }
              }
            }
          }
        }
        if (rule.then) {
          for (let j = 0; j < rule.then.length; j++) {
            const action = rule.then[j];
            if (action.name === "Set Variable") {
              if (action.attribute === "") {
                this.snackbar.open("Please enter the attributes defined in the set variable action" + rule.rule + ".", '', { type: 'warning' })
                return false;
              }
            }
            if (action.operation === "SET_ATTRIBUTE") {
              let reGoodDate = /^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{2})*$/;
              if (action.setFrom === "SET_ATTRIBUTE_MANUALLY") {
                if (action.details.attribute === "") {
                  this.snackbar.open("Please enter the attribute that are available in the action section" + rule.rule + ".", '', { type: 'warning' })
                  return false;
                } else if (action.details.validationType === "Date") {
                  if (!(reGoodDate.test((action.details.value)))) {
                    this.snackbar.open("Please enter a valid date in the format mm/dd/yyyy in set attribute actions" + rule.rule + ".", '', { type: 'warning' })
                    return false;
                  }
                }
                if (action.details.where.length > 0) {
                  for (let k = 0; k < action.details.where.length; k++) {
                    const whereCondition = action.details.where[k];
                    if (whereCondition.sourceAttributeName === '' || whereCondition.sourceOperator === '') {
                      this.snackbar.open("Please fill all the information in set attribute actions" + rule.rule + ".", '', { type: 'warning' })
                      return false;
                    } else if (whereCondition.SourceAttributeValidationType === 'Date') {
                      if (!(reGoodDate.test((whereCondition.sourceValue)))) {
                        this.snackbar.open("Please enter a valid date in the format mm/dd/yyyy in set attribute actions" + rule.rule + ".", '', { type: 'warning' })
                        return false;
                      }
                    }
                  }
                }
              }
              else if (action.setFrom === "SET_ATTRIBUTE_FROM_DATASET") {
                if (action.details.attribute === "" || action.details.datasetName === "" || action.details.categoryName === "" || action.details.targetHeaderName === "") {
                  this.snackbar.open("Please fill all the information in set attribute actions" + rule.rule + ".", '', { type: 'warning' })
                  return false;
                }
                if (action.details.where.length > 0) {
                  for (let k = 0; k < action.details.where.length; k++) {
                    const whereCondition = action.details.where[k];
                    if (whereCondition.sourceAttributeName === '' || whereCondition.sourceOperator === '' || whereCondition.sourceHeaderName === '') {
                      this.snackbar.open("Please fill all the information in set attribute actions" + rule.rule + ".", '', { type: 'warning' })
                      return false;
                    }
                  }
                } else {
                  this.snackbar.open("Please enter atleast one condition for fetching the dataset values in set attribute action" + rule.rule + ".", '', { type: 'warning' })
                  return false;
                }
              } else {
                this.snackbar.open("Please select at least one source for set attribute actions" + rule.rule + ".", '', { type: 'warning' })
                return false;
              }
            }
          }
        }
        rule.rule = rule.rule.trim();
        ruleNames.push(rule.rule.trim());
      }
      ruleNames = [];
    }
    return true;
  }

  getOperatorList() {
    this.operatorListByValidation = {}
    this.apiRequest.getOperatorList().subscribe((res: any) => {
      if (res && res.detail && res.detail.length) {
        res.detail.forEach((operator: any) => {
          if (operator && operator.breOperators && operator.breOperators.length) {
            this.operatorListByValidation[operator.validationTypeName] = operator.breOperators.sort();
          } else {
            this.operatorListByValidation[operator.validationTypeName] = [];
          }
        });
      }
    }, error => {
      this.snackbar.open('Failed to get operator validation list', '', { type: 'warning' });
    })
  }

  getRulesAttributes() {
    this.drlAttributeList = [];
    if (this.projectInfoForm.controls['documentStructure'].value === 'Structured') {
      this.dataSourceForTemplates.data.forEach((template: any) => {
        let templatesAttribute: any = [];
        if (template.templateAttributes.length >= 0) {
          template.templateAttributes.forEach((attributeList: any) => {
            if (attributeList.attributes && attributeList.attributes.length) {
              templatesAttribute = [...templatesAttribute, ...attributeList.attributes]
              this.drlAttributeList = [...this.drlAttributeList, ...attributeList.attributes];
            }
          });
          let obj = {
            'name': template.name,
            'attributes': templatesAttribute
          }
          this.templateAttributeList.push(obj)
        }
      });
    } else if (this.projectInfoForm.controls['documentStructure'].value === 'Semi-Structured' || this.projectInfoForm.controls['documentStructure'].value === 'Free-Form') {
      this.drlAttributeList = [...this.dataSource.data];
    } else {
      // this.drlAttributeList = this.attributeListForPatientDemographics; 
    }
    if (this.drlAttributeList && this.drlAttributeList.length) {
      this.drlAttributeList = this.drlAttributeList.sort((a: any, b: any) => (a.name > b.name) ? 1 : -1)
    }
  }

  getDatasetHeaderList() {
    this.datastHeaderList = {};
    this.dataSourceForDatasets.data.forEach((dataset: any) => {
      if (dataset.status === 'enabled') {
        this.isDatasetEnabled = true;
        this.datastHeaderList[dataset.datasetName] = dataset.headers;
      }

    });
  }

  goNext() {
    if (this.projectInfoForm.controls['project'].errors && this.projectInfoForm.controls['project'].hasError('required')) {
      this.projectErrorMsg = 'Please enter the project name.';
    }
    let projectValidation = this.validateCreateUpdateOperation();
    if (projectValidation.status) {
      this.isProjectCmpleted = true;
      setTimeout(() => {
        this.getRulesAttributes();
        this.getOperatorList();
        this.getDatasetHeaderList();
        this.setStepper(0, 1)
      }, 400);
    } else {
      this.snackbar.open(projectValidation.msg, '', { type: 'warning' });
    }
  }

  private formatDate(dateObj: any) {
    let givenDate = new Date(dateObj);
    let month = givenDate.getMonth() + 1;
    let days = givenDate.getDate();
    let dateFormat = (month < 10 ? '0' : '') + month + '/' + (days < 10 ? '0' : '') + days + '/' + givenDate.getFullYear();
    return dateFormat;
  }

  getSourceValue() {
    let data = this.sourceList[this.sourceChanelForm1.value.sourceChannel];
    let filterEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    data.forEach((e: any, index: any) => {
      if (e.type === 'email') {
        if (!filterEmail.test(this.sourceChanelForm1.value.details[e.fieldName])) {
          this.isEmailvalid = false;
        } else {
          this.isEmailvalid = true;
        }
      }
      e.value = this.sourceChanelForm1.value.details[e.fieldName];
    });
    let obj = {
      channelName: this.sourceChanelForm1.value.sourceChannel === 'GCP Bucket (Default)' ? 'GCP Bucket (Default)' : this.sourceChanelForm1.value.name,
      channelType: this.sourceChanelForm1.value.sourceChannel,
      status: this.sourceChanelForm1.value.status ? 'enabled' : 'disabled',
      verified: true,
      details: data,
      channelId: this.SourceChannelResponse.channelId || null,
      folderId: this.SourceChannelResponse.folderId || null,
      notifications: this.SourceChannelResponse.notifications || null,
      pageToken: this.SourceChannelResponse.pageToken || null,
      resourceId: this.SourceChannelResponse.resourceId || null
    }
    if (obj.channelType !== "GCP Bucket (Default)") {
      obj.folderId = this.folderId || null;
      obj.verified = this.isSourceVerified;
      this.sourceChanelForm1.value.verified = this.isSourceVerified;
    } else {
      this.sourceChanelForm1.value.verified = true;
    }
    return obj;
  }

  testSourceValidaty() {
    if (this.sourceChanelForm1.controls['sourceChannel'].value !== "GCP Bucket (Default)") {
      if (this.sourceChanelForm1.controls['name'].errors && this.sourceChanelForm1.controls['sourceChannel'].value !== "GCP Bucket (Default)") {
        this.snackbar.open('Please check Channel Name', '', { type: 'warning' });
        return false;
      }
      if (this.sourceChanelForm1.value.verified) {
        if (this.isSourceDataChange) {
          this.snackbar.open('Project Name or Source Channel details changed after test connection. Please verify and perform test connection', '', { type: 'warning' });
          return false;
        }
      } else {
        this.snackbar.open('Please verify Source Channels details and perform test connection', '', { type: 'warning' });
        return false;
      }
    }
    return true;
  }

  setStepper(stepPrev: any, currentStep: any) {
    this.Stepper[stepPrev].status = 'done';
    this.Stepper[currentStep].status = 'current';
  }

  sourceDataChanged(value: any, fieldname: any) {
    if (value !== this.testedSourceData[fieldname]) {
      this.isSourceDataChange = true;
    } else {
      this.isSourceDataChange = false;
    }
  }

  trim(name: any) {
    this.projectInfoForm.patchValue({
      project: this.rem(name)
    })
  }

  rem(j: any) {

    return j.value?.
      replace(/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
      replace(/[ ]{2,}/gi, " "). // replaces multiple spaces with one space 
      replace(/\n +/, "\n")
  }

  getuserList(searchKey: any) {
    return this.userList.filter((userName: any) => userName.toLowerCase().includes(searchKey.toLowerCase()))
  }

  onProcessingEngineChange(value: any) {

    this.projectInfoForm.value.processingEngine === value
    // this.attributeListChange =  this.projectInfoForm.value.processingEngine === 'Trade' ? this.attrListForSemiStructure : this.attrListForInmarReturns
    let data = this.projectInfoForm.value.documentStructure === 'Free-Form' ? [] : this.attributeListChange;

    let attributes: any = [];
    this.attributeListChange.forEach((attr: any) => {
      let index = data.findIndex((x: any) => x.name == attr.name);
      index >= 0 ? attributes.push({ ...data[index], isMandatory: false }) : attributes.push({ ...attr, isMandatory: false });
    });
    this.attributeListChange = [...attributes];
    this.dataSource.data = [...data];
    this.isMandatoryHeader = false;

    //******** for table content ********
    this.headerListForInmar = this.projectInfoForm.value.processingEngine === 'Returns' ? this.columnHeadersForInmarType : []
    let inmarData = this.projectInfoForm.value.documentStructure === 'Free-Form' ? [] : this.columnHeadersForInmarType;
    let inmarAttributes: any = [];
    this.headerListForInmar.forEach((attr: any) => {
      let index = inmarData.findIndex(x => x.name == attr.name);
      index >= 0 ? inmarAttributes.push(inmarData[index]) : inmarAttributes.push(attr);
    });
    this.headerListForInmar = [...inmarAttributes];
    this.columnHeadersForInmar.data = [...inmarData];
  }

  onDocumentStructureChange() {
    setTimeout(() => {
      if (this.projectInfoForm.value.documentStructure === 'Structured') {
        this.processingEngineAttributes = this.listForStruct;
        this.projectInfoForm.patchValue({ processingEngine: null });
        this.projectInfoForm.controls['processingEngine'].setValidators([Validators.required]);
        this.setStep(1);
      } else if (this.projectInfoForm.value.documentStructure === 'Semi-Structured') {
        this.processingEngineAttributes = this.listForSemiStruct;
        this.projectInfoForm.controls['processingEngine'].setValidators([Validators.required]);
        this.projectInfoForm.controls['processingEngine'].setValue('Trade');
        this.onProcessingEngineChange('Trade')
        let data = this.projectInfoForm.value.documentStructure === 'Free-Form' ? [] : this.attrListForSemiStructure;
        let attributes: any = [];
        this.attrListForSemiStructure.forEach(attr => {
          let index = data.findIndex(x => x.name == attr.name);
          index >= 0 ? attributes.push({ ...data[index], isMandatory: false }) : attributes.push({ ...attr, isMandatory: false });
        });
        this.attrListForSemiStructure = [...attributes];
        this.dataSource.data = [...data];

        this.setStep(2);
      } else if (this.projectInfoForm.value.documentStructure === 'Free-Form') {
        this.dataSource.data = this.projectInfoForm.value.documentStructure === 'Free-Form' ? [] : JSON.parse(JSON.stringify(this.attrListForSemiStructure));
        // this.projectInfoForm.removeControl('processingEngine');
        this.projectInfoForm.controls['processingEngine'].clearValidators();
        this.projectInfoForm.patchValue({
          processingEngine: null
        })
        this.setStep(2);
      } else {
        this.dataSource.data = this.projectInfoForm.value.documentStructure === 'Medical Chart' ? [] : JSON.parse(JSON.stringify(this.attrListForSemiStructure));
        // this.projectInfoForm.removeControl('processingEngine');
        this.projectInfoForm.controls['processingEngine'].clearValidators();
        this.projectInfoForm.patchValue({
          processingEngine: null
        })
        this.setStep(3);
      }
      this.isMandatoryHeader = false;
      this.projectInfoForm.controls['processingEngine'].updateValueAndValidity();
    }, 0)
  }

  addRemoveScoreCtrol() {
    if (this.projectInfoForm.value.staightThroughProcessing) {
      // this.projectInfoForm.addControl('score', new FormControl(this.straightThroughScore, [Validators.required, Validators.min(0), Validators.max(100)]));    
      this.projectInfoForm.controls['score'].setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      this.projectInfoForm.patchValue({
        score: this.straightThroughScore
      })
    } else {
      this.projectInfoForm.controls['score'].setValidators([Validators.min(0), Validators.max(100)]);
      this.straightThroughScore = this.projectInfoForm.value.score;
      this.projectInfoForm.patchValue({
        score: 0
      })
      // this.projectInfoForm.removeControl('score');
    }
    this.projectInfoForm.controls['score'].updateValueAndValidity();
  }

  addRemoveProjectForm() {
    if (!this.projectInfoForm.value.isSelfServiceEnabled) {
      this.projectInfoForm.patchValue({
        selfServiceForm: ""
      })
      this.projectInfoForm.controls['selfServiceForm'].clearValidators();
    } else {
      this.projectInfoForm.controls['selfServiceForm'].setValidators([Validators.required]);
      this.selfServiceFormMsg = 'Please enter the dynamic form.';
      this.projectInfoForm.patchValue({
        selfServiceForm: this.projectInfoForm.value.selfServiceForm
      })
    }
    this.projectInfoForm.controls['selfServiceForm'].updateValueAndValidity();
  }
}