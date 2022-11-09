import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEditProjectComponent } from './create-project/create-edit-project.component';
import { ProjectsComponent } from './projects/projects.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent
  },
  {
    path: 'create-project',
    component: CreateEditProjectComponent
  },
  {
    path: 'edit-project/:id',
    component: CreateEditProjectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {
  public showCards: boolean | undefined;
}
