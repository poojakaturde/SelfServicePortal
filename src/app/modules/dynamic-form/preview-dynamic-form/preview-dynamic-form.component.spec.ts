import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDynamicFormComponent } from './preview-dynamic-form.component';

describe('PreviewDynamicFormComponent', () => {
  let component: PreviewDynamicFormComponent;
  let fixture: ComponentFixture<PreviewDynamicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDynamicFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
