import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { DocumentRepositoryComponent } from './document-repository.component';
import { DocumentService } from '../document.service';
import { Document } from '../document.model';

const documents: Document[] = [
  {
    id: 'doc-1',
    name: 'Context',
    type: 'Markdown',
    content: '# Context',
    tags: [],
    createdOnUtc: '2026-01-01T00:00:00Z',
    modifiedOnUtc: '2026-01-02T00:00:00Z',
  },
  {
    id: 'doc-2',
    name: 'Component View',
    type: 'Puml',
    content: '@startuml',
    tags: [],
    createdOnUtc: '2026-01-03T00:00:00Z',
    modifiedOnUtc: '2026-01-04T00:00:00Z',
  },
];

describe('DocumentRepositoryComponent', () => {
  let fixture: ComponentFixture<DocumentRepositoryComponent>;
  let component: DocumentRepositoryComponent;
  let service: {
    getAll: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      getAll: jest.fn().mockReturnValue(of(documents)),
      delete: jest.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [DocumentRepositoryComponent],
      providers: [
        provideNoopAnimations(),
        { provide: DocumentService, useValue: service },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads all documents on init and renders a row per document', () => {
    expect(service.getAll).toHaveBeenCalledTimes(1);

    const rows = fixture.debugElement.queryAll(
      By.css('[data-testid="document-row"]'),
    );
    expect(rows).toHaveLength(2);

    const names = fixture.debugElement
      .queryAll(By.css('[data-testid="document-name"]'))
      .map((el) => el.nativeElement.textContent.trim());
    expect(names).toEqual(['Context', 'Component View']);
  });

  it('reloads filtered by the selected type', () => {
    component.selectedType = 'Markdown';
    component.onFilterChange();

    expect(service.getAll).toHaveBeenLastCalledWith('Markdown');
  });

  it('emits the document when a row is selected', () => {
    const selected: Document[] = [];
    component.selectDocument.subscribe((doc) => selected.push(doc));

    const firstRow = fixture.debugElement.query(
      By.css('[data-testid="document-row"]'),
    );
    firstRow.triggerEventHandler('click', {});

    expect(selected).toEqual([documents[0]]);
  });

  it('emits a new-document request when New is clicked', () => {
    const newSpy = jest.fn();
    component.newDocument.subscribe(newSpy);

    const newButton = fixture.debugElement.query(
      By.css('[data-testid="new-document"]'),
    );
    newButton.nativeElement.click();

    expect(newSpy).toHaveBeenCalledTimes(1);
  });

  it('deletes a document and refreshes the list', () => {
    const deleteButton = fixture.debugElement.query(
      By.css('[data-testid="delete-document"]'),
    );
    deleteButton.nativeElement.click();

    expect(service.delete).toHaveBeenCalledWith('doc-1');
    // initial load + reload after delete
    expect(service.getAll).toHaveBeenCalledTimes(2);
  });
});
