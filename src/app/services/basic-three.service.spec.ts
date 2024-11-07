import { TestBed } from '@angular/core/testing';

import { BasicThreeService } from './basic-three.service';

describe('BasicThreeService', () => {
  let service: BasicThreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicThreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
