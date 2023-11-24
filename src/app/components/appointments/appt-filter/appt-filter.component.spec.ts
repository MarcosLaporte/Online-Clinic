import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptFilterComponent } from './appt-filter.component';

describe('ApptFilterComponent', () => {
  let component: ApptFilterComponent;
  let fixture: ComponentFixture<ApptFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApptFilterComponent]
    });
    fixture = TestBed.createComponent(ApptFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
