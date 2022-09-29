import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRenderSubmissionComponent } from './form-render-submission.component';

describe('FormRenderSubmissionComponent', () => {
  let component: FormRenderSubmissionComponent;
  let fixture: ComponentFixture<FormRenderSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRenderSubmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRenderSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
