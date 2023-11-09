import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptSurveyComponent } from './appt-survey.component';

describe('ApptSurveyComponent', () => {
  let component: ApptSurveyComponent;
  let fixture: ComponentFixture<ApptSurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApptSurveyComponent]
    });
    fixture = TestBed.createComponent(ApptSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
