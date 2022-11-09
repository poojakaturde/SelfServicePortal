import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDatasetsComponent } from './project-datasets.component';

describe('ProjectDatasetsComponent', () => {
  let component: ProjectDatasetsComponent;
  let fixture: ComponentFixture<ProjectDatasetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDatasetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
