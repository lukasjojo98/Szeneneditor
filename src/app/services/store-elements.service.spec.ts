import { TestBed } from '@angular/core/testing';

import { StoreElementsService } from './store-elements.service';

describe('StoreElementsService', () => {
  let service: StoreElementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreElementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
