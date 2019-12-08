import { TestBed } from '@angular/core/testing';

import { PurchasedataService } from './purchasedata.service';

describe('PurchasedataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchasedataService = TestBed.get(PurchasedataService);
    expect(service).toBeTruthy();
  });
});
