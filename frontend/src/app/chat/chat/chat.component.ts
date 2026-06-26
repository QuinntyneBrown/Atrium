import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ChatMessage } from '../chat.model';
import { ChatService } from '../chat.service';
import { ChatSignalrService } from '../chat-signalr.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  @Input() systemPrompt?: string;

  models: string[] = [];
  selectedModel = '';
  messages: ChatMessage[] = [];
  draft = '';
  streaming = false;

  constructor(
    private readonly chatService: ChatService,
    private readonly chatSignalr: ChatSignalrService,
    private readonly destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.chatService.getModels().subscribe((models) => {
      this.models = models;
      if (!this.selectedModel && models.length > 0) {
        this.selectedModel = models[0];
      }
    });
  }

  send(): void {
    const content = this.draft.trim();
    if (!content || !this.selectedModel || this.streaming) {
      return;
    }

    this.messages.push({ role: 'user', content });

    const outgoing: ChatMessage[] = [
      ...(this.systemPrompt
        ? [{ role: 'system' as const, content: this.systemPrompt }]
        : []),
      ...this.messages,
    ];

    const assistant: ChatMessage = { role: 'assistant', content: '' };
    this.messages.push(assistant);
    this.draft = '';
    this.streaming = true;

    this.chatSignalr
      .stream({ model: this.selectedModel, messages: outgoing })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (token) => (assistant.content += token),
        error: () => (this.streaming = false),
        complete: () => (this.streaming = false),
      });
  }
}
