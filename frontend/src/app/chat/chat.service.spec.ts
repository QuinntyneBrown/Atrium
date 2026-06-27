import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService],
    });

    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getModels() issues GET /api/chat/models and maps the body', () => {
    let received: { models: string[]; defaultModel: string } | undefined;
    service.getModels().subscribe((result) => (received = result));

    const req = httpMock.expectOne('/api/chat/models');
    expect(req.request.method).toBe('GET');

    const body = { models: ['llama3', 'mistral'], defaultModel: 'mistral' };
    req.flush(body);
    expect(received).toEqual(body);
  });
});
