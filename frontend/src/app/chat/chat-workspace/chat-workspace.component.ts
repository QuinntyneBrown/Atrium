import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ChatComponent } from '../chat/chat.component';
import { DocumentPaletteComponent } from '../document-palette/document-palette.component';
import { PromptBuilderComponent } from '../prompt-builder/prompt-builder.component';

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CommonModule,
    ChatComponent,
    DocumentPaletteComponent,
    PromptBuilderComponent,
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
})
export class ChatWorkspaceComponent {
  systemPrompt?: string;

  onAssembled(prompt: string): void {
    this.systemPrompt = prompt;
  }
}
