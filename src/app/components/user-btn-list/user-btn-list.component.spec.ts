import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBtnListComponent } from './user-btn-list.component';

describe('UserBtnListComponent', () => {
  let component: UserBtnListComponent;
  let fixture: ComponentFixture<UserBtnListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserBtnListComponent]
    });
    fixture = TestBed.createComponent(UserBtnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
