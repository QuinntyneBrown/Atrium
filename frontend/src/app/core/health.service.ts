import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Health {
  status: string;
}

@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly endpoint = '/api/health';

  constructor(private readonly http: HttpClient) {}

  getHealth(): Observable<Health> {
    return this.http.get<Health>(this.endpoint);
  }
}
