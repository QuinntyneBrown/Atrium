import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { DocumentEditorComponent } from './document-editor.component';
import { DocumentService } from '../document.service';
import { Document } from '../document.model';

const existing: Document = {
  id: 'doc-1',
  name: 'Context',
  type: 'Markdown',
  content: '# Context',
  tags: ['adr'],
  createdOnUtc: '2026-01-01T00:00:00Z',
  modifiedOnUtc: '2026-01-02T00:00:00Z',
};

describe('DocumentEditorComponent', () => {
  let fixture: ComponentFixture<DocumentEditorComponent>;
  let component: DocumentEditorComponent;
  let service: {
    create: jest.Mock;
    update: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn().mockReturnValue(of(existing)),
      update: jest.fn().mockReturnValue(of(existing)),
    };

    await TestBed.configureTestingModule({
      imports: [DocumentEditorComponent],
      providers: [
        provideNoopAnimations(),
        { provide: DocumentService, useValue: service },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function clickSave(): void {
    fixture.debugElement
      .query(By.css('[data-testid="save-document"]'))
      .nativeElement.click();
  }

  it('exposes the required form test-ids', () => {
    expect(
      fixture.debugElement.query(By.css('[data-testid="document-name-input"]')),
    ).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css('[data-testid="document-type-select"]')),
    ).not.toBeNull();
    expect(
      fixture.debugElement.query(
        By.css('[data-testid="document-content-input"]'),
      ),
    ).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css('[data-testid="save-document"]')),
    ).not.toBeNull();
  });

  it('creates a new document when there is no current document', () => {
    component.name = 'New Doc';
    component.type = 'Puml';
    component.content = '@startuml';
    component.tags = 'arch, draft';

    clickSave();

    expect(service.create).toHaveBeenCalledWith({
      name: 'New Doc',
      type: 'Puml',
      content: '@startuml',
      tags: ['arch', 'draft'],
    });
    expect(service.update).not.toHaveBeenCalled();
  });

  it('updates the current document when one is being edited', () => {
    component.document = existing;
    fixture.detectChanges();

    component.name = 'Context v2';
    component.content = '# Context v2';
    component.tags = 'adr';

    clickSave();

    expect(service.update).toHaveBeenCalledWith('doc-1', {
      name: 'Context v2',
      content: '# Context v2',
      tags: ['adr'],
    });
    expect(service.create).not.toHaveBeenCalled();
  });

  it('emits saved after a successful save', () => {
    const saved = jest.fn();
    component.saved.subscribe(saved);

    component.name = 'New Doc';
    clickSave();

    expect(saved).toHaveBeenCalledWith(existing);
  });
});
