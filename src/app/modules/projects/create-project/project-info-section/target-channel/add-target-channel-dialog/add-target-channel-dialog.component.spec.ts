import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTargetChannelDialogComponent } from './add-target-channel-dialog.component';

describe('AddTargetChannelDialogComponent', () => {
  let component: AddTargetChannelDialogComponent;
  let fixture: ComponentFixture<AddTargetChannelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTargetChannelDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTargetChannelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
