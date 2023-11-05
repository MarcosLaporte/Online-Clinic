import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistNotEnabledComponent } from './specialist-not-enabled.component';

describe('SpecialistNotEnabledComponent', () => {
  let component: SpecialistNotEnabledComponent;
  let fixture: ComponentFixture<SpecialistNotEnabledComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialistNotEnabledComponent]
    });
    fixture = TestBed.createComponent(SpecialistNotEnabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
