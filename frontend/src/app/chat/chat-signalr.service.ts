import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
} from '@microsoft/signalr';
import { Observable } from 'rxjs';

import { StreamChatCommand } from './chat.model';

export const CHAT_HUB_URL = '/hubs/chat';

export type ChatHubConnectionFactory = () => HubConnection;

/** Builds the raw SignalR connection. Overridable in tests. */
export const CHAT_HUB_CONNECTION_FACTORY =
  new InjectionToken<ChatHubConnectionFactory>('CHAT_HUB_CONNECTION_FACTORY', {
    providedIn: 'root',
    factory: () => () =>
      new HubConnectionBuilder()
        .withUrl(CHAT_HUB_URL)
        .withAutomaticReconnect()
        .build(),
  });

@Injectable({ providedIn: 'root' })
export class ChatSignalrService {
  private connection?: HubConnection;
  private starting?: Promise<void>;

  constructor(
    @Inject(CHAT_HUB_CONNECTION_FACTORY)
    private readonly createConnection: ChatHubConnectionFactory,
  ) {}

  async connect(): Promise<void> {
    if (this.connection) {
      return this.starting ?? Promise.resolve();
    }

    const connection = this.createConnection();
    this.connection = connection;
    this.starting = connection.start().catch((error) => {
      // Reset so a later call retries instead of forever awaiting a rejected promise.
      this.connection = undefined;
      this.starting = undefined;
      throw error;
    });
    await this.starting;
  }

  /** Streams assistant tokens for the given chat command. */
  stream(command: StreamChatCommand): Observable<string> {
    return new Observable<string>((subscriber) => {
      let cancelled = false;
      let subscription: { dispose: () => void } | undefined;

      this.connect()
        .then(() => {
          if (cancelled) {
            return;
          }
          subscription = this.connection!
            .stream<string>('StreamChat', command)
            .subscribe({
              next: (token) => subscriber.next(token),
              error: (error) => subscriber.error(error),
              complete: () => subscriber.complete(),
            });
        })
        .catch((error) => subscriber.error(error));

      return () => {
        cancelled = true;
        subscription?.dispose();
      };
    });
  }
}
