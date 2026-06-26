import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { DocumentWorkspaceComponent } from './document-workspace.component';
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
];

describe('DocumentWorkspaceComponent', () => {
  let fixture: ComponentFixture<DocumentWorkspaceComponent>;
  let service: {
    getAll: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      getAll: jest.fn().mockReturnValue(of(documents)),
      create: jest.fn().mockReturnValue(of(documents[0])),
      update: jest.fn().mockReturnValue(of(documents[0])),
      delete: jest.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [DocumentWorkspaceComponent],
      providers: [
        provideNoopAnimations(),
        { provide: DocumentService, useValue: service },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentWorkspaceComponent);
    fixture.detectChanges();
  });

  it('renders the repository and the editor together', () => {
    expect(
      fixture.debugElement.query(By.css('[data-testid="document-list"]')),
    ).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css('[data-testid="document-name-input"]')),
    ).not.toBeNull();
  });

  it('creates a document when New is clicked and then Save', () => {
    fixture.debugElement
      .query(By.css('[data-testid="new-document"]'))
      .nativeElement.click();
    fixture.detectChanges();

    const nameInput = fixture.debugElement.query(
      By.css('[data-testid="document-name-input"]'),
    ).nativeElement as HTMLInputElement;
    nameInput.value = 'Drafted';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('[data-testid="save-document"]'))
      .nativeElement.click();

    expect(service.create).toHaveBeenCalledTimes(1);
    expect(service.create.mock.calls[0][0].name).toBe('Drafted');
  });

  it('refreshes the list after a save', () => {
    expect(service.getAll).toHaveBeenCalledTimes(1);

    fixture.debugElement
      .query(By.css('[data-testid="save-document"]'))
      .nativeElement.click();

    expect(service.getAll).toHaveBeenCalledTimes(2);
  });
});
