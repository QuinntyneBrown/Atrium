import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Subject, of } from 'rxjs';

import { ChatComponent } from './chat.component';
import { ChatService } from '../chat.service';
import { ChatSignalrService } from '../chat-signalr.service';

describe('ChatComponent', () => {
  let fixture: ComponentFixture<ChatComponent>;
  let component: ChatComponent;
  let chatService: { getModels: jest.Mock };
  let chatSignalr: { stream: jest.Mock };
  let stream$: Subject<string>;

  beforeEach(async () => {
    chatService = { getModels: jest.fn().mockReturnValue(of(['llama3', 'mistral'])) };
    stream$ = new Subject<string>();
    chatSignalr = { stream: jest.fn().mockReturnValue(stream$.asObservable()) };

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        provideNoopAnimations(),
        { provide: ChatService, useValue: chatService },
        { provide: ChatSignalrService, useValue: chatSignalr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
  });

  function query(testId: string) {
    return fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
  }

  it('populates the model select from getModels and defaults to the first', () => {
    fixture.detectChanges();

    expect(chatService.getModels).toHaveBeenCalledTimes(1);
    expect(component.models).toEqual(['llama3', 'mistral']);
    expect(component.selectedModel).toBe('llama3');
    expect(query('chat-model-select')).not.toBeNull();
  });

  it('sends a user message and accumulates streamed tokens into an assistant message', () => {
    fixture.detectChanges();

    component.draft = 'Hello there';
    query('chat-send').nativeElement.click();

    expect(chatSignalr.stream).toHaveBeenCalledWith({
      model: 'llama3',
      messages: [{ role: 'user', content: 'Hello there' }],
    });

    stream$.next('Hi');
    stream$.next(' back');
    fixture.detectChanges();

    const assistant = query('chat-assistant-message');
    expect(assistant).not.toBeNull();
    expect(assistant.nativeElement.textContent).toContain('Hi back');

    const messages = fixture.debugElement.queryAll(
      By.css('[data-testid="chat-message"]'),
    );
    expect(messages).toHaveLength(2);
  });

  it('prepends the systemPrompt as a system message when provided', () => {
    fixture.componentRef.setInput('systemPrompt', 'You are an architect.');
    fixture.detectChanges();

    component.draft = 'Review this';
    query('chat-send').nativeElement.click();

    expect(chatSignalr.stream).toHaveBeenCalledWith({
      model: 'llama3',
      messages: [
        { role: 'system', content: 'You are an architect.' },
        { role: 'user', content: 'Review this' },
      ],
    });
  });
});
