import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetChannelComponent } from './target-channel.component';

describe('TargetChannelComponent', () => {
  let component: TargetChannelComponent;
  let fixture: ComponentFixture<TargetChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
