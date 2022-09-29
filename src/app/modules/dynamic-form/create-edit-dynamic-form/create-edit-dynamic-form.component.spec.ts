import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditDynamicFormComponent } from './create-edit-dynamic-form.component';

describe('CreateEditDynamicFormComponent', () => {
  let component: CreateEditDynamicFormComponent;
  let fixture: ComponentFixture<CreateEditDynamicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditDynamicFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
