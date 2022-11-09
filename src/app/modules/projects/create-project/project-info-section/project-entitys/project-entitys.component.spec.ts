import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEntitysComponent } from './project-entitys.component';

describe('ProjectEntitysComponent', () => {
  let component: ProjectEntitysComponent;
  let fixture: ComponentFixture<ProjectEntitysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectEntitysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEntitysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
