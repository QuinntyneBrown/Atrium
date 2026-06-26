import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { PromptTemplateService } from './prompt-template.service';
import {
  CreatePromptTemplateRequest,
  PromptTemplate,
  UpdatePromptTemplateRequest,
} from './prompt-template.model';

const sample: PromptTemplate = {
  id: 'pt-1',
  name: 'CHECK',
  mode: 'Check',
  body: 'Check {{document}}',
  isBuiltIn: true,
  createdOnUtc: '2026-01-01T00:00:00Z',
  modifiedOnUtc: '2026-01-02T00:00:00Z',
};

describe('PromptTemplateService', () => {
  let service: PromptTemplateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PromptTemplateService],
    });

    service = TestBed.inject(PromptTemplateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAll() issues GET /api/prompttemplates', () => {
    let received: PromptTemplate[] | undefined;
    service.getAll().subscribe((templates) => (received = templates));

    const req = httpMock.expectOne('/api/prompttemplates');
    expect(req.request.method).toBe('GET');

    req.flush([sample]);
    expect(received).toEqual([sample]);
  });

  it('create() POSTs the body to /api/prompttemplates', () => {
    const body: CreatePromptTemplateRequest = {
      name: 'My Template',
      mode: 'Custom',
      body: 'Hello {{name}}',
    };

    let received: PromptTemplate | undefined;
    service.create(body).subscribe((template) => (received = template));

    const req = httpMock.expectOne('/api/prompttemplates');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(sample);
    expect(received).toEqual(sample);
  });

  it('update() PUTs the body to /api/prompttemplates/{id}', () => {
    const body: UpdatePromptTemplateRequest = {
      name: 'Renamed',
      mode: 'Custom',
      body: 'Updated',
    };

    service.update('pt-1', body).subscribe();

    const req = httpMock.expectOne('/api/prompttemplates/pt-1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);

    req.flush({ ...sample, ...body });
  });

  it('delete() issues DELETE /api/prompttemplates/{id}', () => {
    service.delete('pt-1').subscribe();

    const req = httpMock.expectOne('/api/prompttemplates/pt-1');
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
