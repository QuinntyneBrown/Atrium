import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
} from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

export interface DiagramRendered {
  documentId: string;
  svg: string;
}

export const DIAGRAM_HUB_URL = '/hubs/diagram';

export type HubConnectionFactory = () => HubConnection;

/**
 * Builds the raw SignalR connection. Overridable in tests so specs can
 * substitute a fake connection without touching the network.
 */
export const DIAGRAM_HUB_CONNECTION_FACTORY =
  new InjectionToken<HubConnectionFactory>('DIAGRAM_HUB_CONNECTION_FACTORY', {
    providedIn: 'root',
    factory: () => () =>
      new HubConnectionBuilder()
        .withUrl(DIAGRAM_HUB_URL)
        .withAutomaticReconnect()
        .build(),
  });

@Injectable({ providedIn: 'root' })
export class DiagramSignalrService {
  private connection?: HubConnection;
  private starting?: Promise<void>;
  private readonly rendered = new Subject<DiagramRendered>();

  readonly diagramRendered$: Observable<DiagramRendered> =
    this.rendered.asObservable();

  constructor(
    @Inject(DIAGRAM_HUB_CONNECTION_FACTORY)
    private readonly createConnection: HubConnectionFactory,
  ) {}

  async connect(): Promise<void> {
    if (this.connection) {
      return this.starting ?? Promise.resolve();
    }

    const connection = this.createConnection();
    connection.on('DiagramRendered', (documentId: string, svg: string) => {
      this.rendered.next({ documentId, svg });
    });
    this.connection = connection;
    this.starting = connection.start().catch((error) => {
      // Reset so a later call retries instead of forever awaiting a rejected promise.
      this.connection = undefined;
      this.starting = undefined;
      throw error;
    });
    await this.starting;
  }

  async render(documentId: string, source: string): Promise<void> {
    await this.connect();
    await this.connection!.invoke('Render', documentId, source);
  }
}
