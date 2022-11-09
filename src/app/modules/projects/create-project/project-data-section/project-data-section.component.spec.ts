import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDataSectionComponent } from './project-data-section.component';

describe('ProjectDataSectionComponent', () => {
  let component: ProjectDataSectionComponent;
  let fixture: ComponentFixture<ProjectDataSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDataSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDataSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
