import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { DiagramPreviewComponent } from './diagram-preview.component';
import {
  DiagramRendered,
  DiagramSignalrService,
} from '../diagram-signalr.service';

describe('DiagramPreviewComponent', () => {
  let fixture: ComponentFixture<DiagramPreviewComponent>;
  let rendered$: Subject<DiagramRendered>;
  let signalr: { render: jest.Mock; connect: jest.Mock; diagramRendered$: unknown };

  beforeEach(async () => {
    rendered$ = new Subject<DiagramRendered>();
    signalr = {
      render: jest.fn().mockResolvedValue(undefined),
      connect: jest.fn().mockResolvedValue(undefined),
      diagramRendered$: rendered$.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [DiagramPreviewComponent],
      providers: [{ provide: DiagramSignalrService, useValue: signalr }],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagramPreviewComponent);
  });

  it('debounces content changes then asks the service to render', fakeAsync(() => {
    fixture.componentRef.setInput('document', {
      id: 'doc-1',
      content: '@startuml',
    });
    fixture.detectChanges();

    expect(signalr.render).not.toHaveBeenCalled();

    tick(400);
    expect(signalr.render).toHaveBeenCalledWith('doc-1', '@startuml');
    flush();
  }));

  it('displays the rendered svg inside [data-testid="diagram-svg"]', fakeAsync(() => {
    fixture.componentRef.setInput('document', {
      id: 'doc-1',
      content: '@startuml',
    });
    fixture.detectChanges();
    tick(400);

    rendered$.next({ documentId: 'doc-1', svg: '<svg data-x="1">hi</svg>' });
    fixture.detectChanges();

    const host = fixture.debugElement.query(
      By.css('[data-testid="diagram-svg"]'),
    );
    expect(host).not.toBeNull();
    expect(host.nativeElement.innerHTML).toContain('<svg');
    flush();
  }));

  it('ignores svg rendered for a different document', fakeAsync(() => {
    fixture.componentRef.setInput('document', {
      id: 'doc-1',
      content: '@startuml',
    });
    fixture.detectChanges();
    tick(400);

    rendered$.next({ documentId: 'other', svg: '<svg>nope</svg>' });
    fixture.detectChanges();

    const host = fixture.debugElement.query(
      By.css('[data-testid="diagram-svg"]'),
    );
    expect(host.nativeElement.innerHTML).not.toContain('nope');
    flush();
  }));
});
