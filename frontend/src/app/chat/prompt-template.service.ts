import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CreatePromptTemplateRequest,
  PromptTemplate,
  UpdatePromptTemplateRequest,
} from './prompt-template.model';

@Injectable({ providedIn: 'root' })
export class PromptTemplateService {
  private readonly baseUrl = '/api/prompttemplates';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<PromptTemplate[]> {
    return this.http.get<PromptTemplate[]>(this.baseUrl);
  }

  create(request: CreatePromptTemplateRequest): Observable<PromptTemplate> {
    return this.http.post<PromptTemplate>(this.baseUrl, request);
  }

  update(
    id: string,
    request: UpdatePromptTemplateRequest,
  ): Observable<PromptTemplate> {
    return this.http.put<PromptTemplate>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
