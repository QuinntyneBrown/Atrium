import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { EMPTY, of } from 'rxjs';

import { ChatWorkspaceComponent } from './chat-workspace.component';
import { ChatService } from '../chat.service';
import { ChatSignalrService } from '../chat-signalr.service';
import { PromptTemplateService } from '../prompt-template.service';
import { DocumentService } from '../../documents/document.service';

describe('ChatWorkspaceComponent', () => {
  let fixture: ComponentFixture<ChatWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWorkspaceComponent],
      providers: [
        provideNoopAnimations(),
        { provide: ChatService, useValue: { getModels: () => of([]) } },
        { provide: ChatSignalrService, useValue: { stream: () => EMPTY } },
        {
          provide: PromptTemplateService,
          useValue: { getAll: () => of([]), create: () => EMPTY },
        },
        { provide: DocumentService, useValue: { getAll: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatWorkspaceComponent);
  });

  function query(testId: string) {
    return fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
  }

  it('renders the prompt builder and the chat side by side', () => {
    fixture.detectChanges();
    expect(query('prompt-template-select')).not.toBeNull();
    expect(query('chat-model-select')).not.toBeNull();
  });

  it('forwards an assembled prompt to the chat as the system prompt', () => {
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.onAssembled('Assembled system prompt');
    fixture.detectChanges();

    expect(component.systemPrompt).toBe('Assembled system prompt');
  });
});
