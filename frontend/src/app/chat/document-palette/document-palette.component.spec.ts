import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { DocumentPaletteComponent } from './document-palette.component';
import { DocumentService } from '../../documents/document.service';
import { Document } from '../../documents/document.model';

const documents: Document[] = [
  {
    id: 'd1',
    name: 'context-pack.md',
    type: 'Markdown',
    content: '# Context',
    tags: [],
    createdOnUtc: '2026-01-01T00:00:00Z',
    modifiedOnUtc: '2026-01-01T00:00:00Z',
  },
  {
    id: 'd2',
    name: 'diagram.puml',
    type: 'Puml',
    content: '@startuml',
    tags: [],
    createdOnUtc: '2026-01-01T00:00:00Z',
    modifiedOnUtc: '2026-01-01T00:00:00Z',
  },
];

describe('DocumentPaletteComponent', () => {
  let fixture: ComponentFixture<DocumentPaletteComponent>;
  let documentService: { getAll: jest.Mock };

  beforeEach(async () => {
    documentService = { getAll: jest.fn().mockReturnValue(of(documents)) };

    await TestBed.configureTestingModule({
      imports: [DocumentPaletteComponent],
      providers: [{ provide: DocumentService, useValue: documentService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentPaletteComponent);
  });

  it('lists draggable documents from the service', () => {
    fixture.detectChanges();

    expect(documentService.getAll).toHaveBeenCalledTimes(1);
    const items = fixture.debugElement.queryAll(By.css('[data-testid="palette-document"]'));
    expect(items).toHaveLength(2);
    expect(items[0].nativeElement.textContent).toContain('context-pack.md');
  });
});
