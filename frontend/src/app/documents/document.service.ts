import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CreateDocumentRequest,
  Document,
  DocumentType,
  UpdateDocumentRequest,
} from './document.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly baseUrl = '/api/documents';

  constructor(private readonly http: HttpClient) {}

  getAll(type?: DocumentType): Observable<Document[]> {
    let params = new HttpParams();
    if (type) {
      params = params.set('type', type);
    }
    return this.http.get<Document[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateDocumentRequest): Observable<Document> {
    return this.http.post<Document>(this.baseUrl, request);
  }

  update(id: string, request: UpdateDocumentRequest): Observable<Document> {
    return this.http.put<Document>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
