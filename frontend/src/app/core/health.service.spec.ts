import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HealthService],
    });

    service = TestBed.inject(HealthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('issues GET /api/health', () => {
    service.getHealth().subscribe();

    const req = httpMock.expectOne('/api/health');
    expect(req.request.method).toBe('GET');

    req.flush({ status: 'Healthy' });
  });

  it('maps the response body to the emitted value', () => {
    let received: { status: string } | undefined;

    service.getHealth().subscribe((health) => (received = health));

    httpMock.expectOne('/api/health').flush({ status: 'Healthy' });

    expect(received).toEqual({ status: 'Healthy' });
  });
});
