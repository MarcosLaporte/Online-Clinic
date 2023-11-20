import { TestBed } from '@angular/core/testing';

import { AfReferencesService } from './af-references.service';

describe('AfReferencesService', () => {
  let service: AfReferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfReferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
