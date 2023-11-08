import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAppointmentComponent } from './list-appointment.component';

describe('ListAppointmentComponent', () => {
  let component: ListAppointmentComponent;
  let fixture: ComponentFixture<ListAppointmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListAppointmentComponent]
    });
    fixture = TestBed.createComponent(ListAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
