import { TestBed } from '@angular/core/testing';
import { HubConnection } from '@microsoft/signalr';

import {
  DIAGRAM_HUB_CONNECTION_FACTORY,
  DiagramRendered,
  DiagramSignalrService,
} from './diagram-signalr.service';

interface FakeConnection {
  on: jest.Mock;
  off: jest.Mock;
  invoke: jest.Mock;
  start: jest.Mock;
  stop: jest.Mock;
  handlers: Record<string, (...args: unknown[]) => void>;
}

function createFakeConnection(): FakeConnection {
  const handlers: Record<string, (...args: unknown[]) => void> = {};
  return {
    handlers,
    on: jest.fn((event: string, cb: (...args: unknown[]) => void) => {
      handlers[event] = cb;
    }),
    off: jest.fn(),
    invoke: jest.fn().mockResolvedValue(undefined),
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined),
  };
}

describe('DiagramSignalrService', () => {
  let service: DiagramSignalrService;
  let connection: FakeConnection;
  let factory: jest.Mock;

  beforeEach(() => {
    connection = createFakeConnection();
    factory = jest.fn(() => connection as unknown as HubConnection);

    TestBed.configureTestingModule({
      providers: [
        DiagramSignalrService,
        { provide: DIAGRAM_HUB_CONNECTION_FACTORY, useValue: factory },
      ],
    });

    service = TestBed.inject(DiagramSignalrService);
  });

  it('starts a single connection and registers the DiagramRendered handler', async () => {
    await service.connect();
    await service.connect();

    expect(factory).toHaveBeenCalledTimes(1);
    expect(connection.start).toHaveBeenCalledTimes(1);
    expect(connection.on).toHaveBeenCalledWith(
      'DiagramRendered',
      expect.any(Function),
    );
  });

  it('render() connects then invokes Render with the document id and source', async () => {
    await service.render('doc-1', '@startuml');

    expect(connection.start).toHaveBeenCalledTimes(1);
    expect(connection.invoke).toHaveBeenCalledWith(
      'Render',
      'doc-1',
      '@startuml',
    );
  });

  it('surfaces DiagramRendered events on diagramRendered$', async () => {
    const received: DiagramRendered[] = [];
    service.diagramRendered$.subscribe((event) => received.push(event));

    await service.connect();
    connection.handlers['DiagramRendered']('doc-1', '<svg>ok</svg>');

    expect(received).toEqual([{ documentId: 'doc-1', svg: '<svg>ok</svg>' }]);
  });
});
