import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptDiagnosisComponent } from './appt-diagnosis.component';

describe('ApptDiagnosisComponent', () => {
  let component: ApptDiagnosisComponent;
  let fixture: ComponentFixture<ApptDiagnosisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApptDiagnosisComponent]
    });
    fixture = TestBed.createComponent(ApptDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
