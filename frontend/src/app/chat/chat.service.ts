import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ChatModelsResult } from './chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly baseUrl = '/api/chat';

  constructor(private readonly http: HttpClient) {}

  getModels(): Observable<ChatModelsResult> {
    return this.http.get<ChatModelsResult>(`${this.baseUrl}/models`);
  }
}
