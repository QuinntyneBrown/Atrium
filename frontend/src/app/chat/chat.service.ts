import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly baseUrl = '/api/chat';

  constructor(private readonly http: HttpClient) {}

  getModels(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/models`);
  }
}
