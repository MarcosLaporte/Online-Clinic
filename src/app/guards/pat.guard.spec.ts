import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { patGuard } from './pat.guard';

describe('patGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => patGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
