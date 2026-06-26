import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMarkdown } from 'ngx-markdown';
import { Subject } from 'rxjs';

import { DocumentPreviewComponent } from './document-preview.component';
import {
  DiagramRendered,
  DiagramSignalrService,
} from '../diagram-signalr.service';
import { Document } from '../../documents/document.model';

function makeDocument(overrides: Partial<Document>): Document {
  return {
    id: 'doc-1',
    name: 'Doc',
    type: 'Markdown',
    content: 'content',
    tags: [],
    createdOnUtc: '2026-01-01T00:00:00Z',
    modifiedOnUtc: '2026-01-02T00:00:00Z',
    ...overrides,
  };
}

describe('DocumentPreviewComponent', () => {
  let fixture: ComponentFixture<DocumentPreviewComponent>;

  beforeEach(async () => {
    const signalr = {
      render: jest.fn().mockResolvedValue(undefined),
      connect: jest.fn().mockResolvedValue(undefined),
      diagramRendered$: new Subject<DiagramRendered>().asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [DocumentPreviewComponent],
      providers: [
        provideMarkdown(),
        { provide: DiagramSignalrService, useValue: signalr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentPreviewComponent);
  });

  function queryTestId(id: string) {
    return fixture.debugElement.query(By.css(`[data-testid="${id}"]`));
  }

  it('always renders the [data-testid="document-preview"] host', () => {
    fixture.detectChanges();
    expect(queryTestId('document-preview')).not.toBeNull();
  });

  it('shows the diagram preview for a Puml document', () => {
    fixture.componentRef.setInput('document', makeDocument({ type: 'Puml' }));
    fixture.detectChanges();

    expect(queryTestId('diagram-svg')).not.toBeNull();
    expect(queryTestId('markdown-preview')).toBeNull();
    expect(queryTestId('drawio-preview')).toBeNull();
  });

  it('shows the markdown preview for a Markdown document', () => {
    fixture.componentRef.setInput('document', makeDocument({ type: 'Markdown' }));
    fixture.detectChanges();

    expect(queryTestId('markdown-preview')).not.toBeNull();
    expect(queryTestId('diagram-svg')).toBeNull();
    expect(queryTestId('drawio-preview')).toBeNull();
  });

  it('shows the drawio preview for a Drawio document', () => {
    fixture.componentRef.setInput('document', makeDocument({ type: 'Drawio' }));
    fixture.detectChanges();

    expect(queryTestId('drawio-preview')).not.toBeNull();
    expect(queryTestId('diagram-svg')).toBeNull();
    expect(queryTestId('markdown-preview')).toBeNull();
  });
});
