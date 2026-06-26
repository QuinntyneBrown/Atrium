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
    let received: string[] | undefined;
    service.getModels().subscribe((models) => (received = models));

    const req = httpMock.expectOne('/api/chat/models');
    expect(req.request.method).toBe('GET');

    req.flush(['llama3', 'mistral']);
    expect(received).toEqual(['llama3', 'mistral']);
  });
});
