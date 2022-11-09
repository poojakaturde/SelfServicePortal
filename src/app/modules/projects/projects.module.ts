import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects/projects.component';
import {MaterialModule} from '../Material/material.module';
import { CreateEditProjectComponent } from './create-project/create-edit-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectDataSectionComponent } from './create-project/project-data-section/project-data-section.component';
import { ProjectInfoSectionComponent } from './create-project/project-info-section/project-info-section.component';
import { ProjectDataComponent } from './create-project/project-data-section/project-data/project-data.component';
import { ProjectDatasetsComponent } from './create-project/project-data-section/project-datasets/project-datasets.component';
import { ProjectVariablesComponent } from './create-project/project-data-section/project-variables/project-variables.component';
import { ApiConfigurationComponent } from './create-project/project-info-section/api-configuration/api-configuration.component';
import { DocumentIngestionComponent } from './create-project/project-info-section/document-ingestion/document-ingestion.component';
import { ProjectAttributesComponent } from './create-project/project-info-section/project-attributes/project-attributes.component';
import { ProjectEntitysComponent } from './create-project/project-info-section/project-entitys/project-entitys.component';
import { ProjectInfoComponent } from './create-project/project-info-section/project-info/project-info.component';
import { ProjectRolesComponent } from './create-project/project-info-section/project-roles/project-roles.component';
import { ProjectTemplatesComponent } from './create-project/project-info-section/project-templates/project-templates.component';
import { TargetChannelComponent } from './create-project/project-info-section/target-channel/target-channel.component';
import { AddApiDialogComponent } from './create-project/project-info-section/api-configuration/add-api-dialog/add-api-dialog.component';
import { AddTargetChannelDialogComponent } from './create-project/project-info-section/target-channel/add-target-channel-dialog/add-target-channel-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AngularSplitModule } from 'angular-split';

@NgModule({
  declarations: [
    ProjectsComponent,
    CreateEditProjectComponent,
    ProjectDataSectionComponent,
    ProjectInfoSectionComponent,
    ProjectDataComponent,
    ProjectDatasetsComponent,
    ProjectVariablesComponent,
    ApiConfigurationComponent,
    DocumentIngestionComponent,
    ProjectAttributesComponent,
    ProjectEntitysComponent,
    ProjectInfoComponent,
    ProjectRolesComponent,
    ProjectTemplatesComponent,
    TargetChannelComponent,
    AddApiDialogComponent,
    AddTargetChannelDialogComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    AngularSplitModule
  ]
})
export class ProjectsModule { }
