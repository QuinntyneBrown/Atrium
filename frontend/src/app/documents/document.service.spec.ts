import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { DocumentService } from './document.service';
import {
  CreateDocumentRequest,
  Document,
  UpdateDocumentRequest,
} from './document.model';

const sampleDocument: Document = {
  id: 'doc-1',
  name: 'Context',
  type: 'Markdown',
  content: '# Context',
  tags: ['adr'],
  createdOnUtc: '2026-01-01T00:00:00Z',
  modifiedOnUtc: '2026-01-02T00:00:00Z',
};

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentService],
    });

    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAll() issues GET /api/documents with no params and maps the body', () => {
    let received: Document[] | undefined;
    service.getAll().subscribe((docs) => (received = docs));

    const req = httpMock.expectOne(
      (r) => r.url === '/api/documents' && !r.params.has('type'),
    );
    expect(req.request.method).toBe('GET');

    req.flush([sampleDocument]);
    expect(received).toEqual([sampleDocument]);
  });

  it('getAll(type) sets the ?type= query parameter', () => {
    service.getAll('Markdown').subscribe();

    const req = httpMock.expectOne(
      (r) => r.url === '/api/documents' && r.params.get('type') === 'Markdown',
    );
    expect(req.request.method).toBe('GET');
    req.flush([sampleDocument]);
  });

  it('getById(id) issues GET /api/documents/{id}', () => {
    let received: Document | undefined;
    service.getById('doc-1').subscribe((doc) => (received = doc));

    const req = httpMock.expectOne('/api/documents/doc-1');
    expect(req.request.method).toBe('GET');

    req.flush(sampleDocument);
    expect(received).toEqual(sampleDocument);
  });

  it('create(req) POSTs the body to /api/documents', () => {
    const body: CreateDocumentRequest = {
      name: 'Context',
      type: 'Markdown',
      content: '# Context',
      tags: ['adr'],
    };

    let received: Document | undefined;
    service.create(body).subscribe((doc) => (received = doc));

    const req = httpMock.expectOne('/api/documents');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(sampleDocument);
    expect(received).toEqual(sampleDocument);
  });

  it('update(id, req) PUTs the body to /api/documents/{id}', () => {
    const body: UpdateDocumentRequest = {
      name: 'Context v2',
      content: '# Context v2',
      tags: ['adr', 'reviewed'],
    };

    service.update('doc-1', body).subscribe();

    const req = httpMock.expectOne('/api/documents/doc-1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);

    req.flush({ ...sampleDocument, ...body });
  });

  it('delete(id) issues DELETE /api/documents/{id}', () => {
    service.delete('doc-1').subscribe();

    const req = httpMock.expectOne('/api/documents/doc-1');
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
