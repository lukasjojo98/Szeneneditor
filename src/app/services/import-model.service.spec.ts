import { TestBed } from '@angular/core/testing';

import { ImportModelService } from './import-model.service';

describe('ImportModelService', () => {
  let service: ImportModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
