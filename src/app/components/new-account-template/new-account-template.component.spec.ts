import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAccountTemplateComponent } from './new-account-template.component';

describe('NewAccountTemplateComponent', () => {
  let component: NewAccountTemplateComponent;
  let fixture: ComponentFixture<NewAccountTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewAccountTemplateComponent]
    });
    fixture = TestBed.createComponent(NewAccountTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
