import { TestBed } from '@angular/core/testing';

import { ResearcherIdResolver } from './researcher-id.resolver';

describe('ResearcherIdResolver', () => {
  let resolver: ResearcherIdResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ResearcherIdResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
