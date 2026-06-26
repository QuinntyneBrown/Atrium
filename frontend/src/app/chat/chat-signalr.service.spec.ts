import { TestBed } from '@angular/core/testing';
import { HubConnection } from '@microsoft/signalr';

import {
  CHAT_HUB_CONNECTION_FACTORY,
  ChatSignalrService,
} from './chat-signalr.service';
import { StreamChatCommand } from './chat.model';

interface StreamObserver {
  next: (value: string) => void;
  error: (err: unknown) => void;
  complete: () => void;
}

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('ChatSignalrService', () => {
  let service: ChatSignalrService;
  let connection: {
    start: jest.Mock;
    stop: jest.Mock;
    stream: jest.Mock;
  };
  let observer: StreamObserver;
  let dispose: jest.Mock;

  const command: StreamChatCommand = {
    model: 'llama3',
    messages: [{ role: 'user', content: 'Hi' }],
  };

  beforeEach(() => {
    dispose = jest.fn();
    connection = {
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
      stream: jest.fn(() => ({
        subscribe: (obs: StreamObserver) => {
          observer = obs;
          return { dispose };
        },
      })),
    };

    TestBed.configureTestingModule({
      providers: [
        ChatSignalrService,
        {
          provide: CHAT_HUB_CONNECTION_FACTORY,
          useValue: () => connection as unknown as HubConnection,
        },
      ],
    });

    service = TestBed.inject(ChatSignalrService);
  });

  it('connects then streams StreamChat tokens as an observable', async () => {
    const tokens: string[] = [];
    let completed = false;

    service.stream(command).subscribe({
      next: (token) => tokens.push(token),
      complete: () => (completed = true),
    });

    await flushPromises();

    expect(connection.start).toHaveBeenCalledTimes(1);
    expect(connection.stream).toHaveBeenCalledWith('StreamChat', command);

    observer.next('Hello');
    observer.next(' world');
    observer.complete();

    expect(tokens).toEqual(['Hello', ' world']);
    expect(completed).toBe(true);
  });

  it('disposes the underlying stream when unsubscribed', async () => {
    const subscription = service.stream(command).subscribe();
    await flushPromises();

    subscription.unsubscribe();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it('retries with a fresh connection after an initial start failure', async () => {
    connection.start
      .mockRejectedValueOnce(new Error('negotiate failed'))
      .mockResolvedValueOnce(undefined);

    let firstError: unknown;
    service.stream(command).subscribe({ error: (e) => (firstError = e) });
    await flushPromises();
    expect(firstError).toBeDefined();

    const tokens: string[] = [];
    service.stream(command).subscribe({ next: (token) => tokens.push(token) });
    await flushPromises();

    expect(connection.start).toHaveBeenCalledTimes(2);
    observer.next('ok');
    expect(tokens).toEqual(['ok']);
  });
});
