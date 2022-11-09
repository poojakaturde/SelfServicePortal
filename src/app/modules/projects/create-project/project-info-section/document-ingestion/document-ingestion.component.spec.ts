import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentIngestionComponent } from './document-ingestion.component';

describe('DocumentIngestionComponent', () => {
  let component: DocumentIngestionComponent;
  let fixture: ComponentFixture<DocumentIngestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentIngestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentIngestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
