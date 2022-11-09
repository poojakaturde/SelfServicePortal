import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectVariablesComponent } from './project-variables.component';

describe('ProjectVariablesComponent', () => {
  let component: ProjectVariablesComponent;
  let fixture: ComponentFixture<ProjectVariablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectVariablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
