import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  DOCUMENT_TYPES,
  Document,
  DocumentType,
} from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './document-editor.component.html',
  styleUrl: './document-editor.component.scss',
})
export class DocumentEditorComponent {
  readonly types = DOCUMENT_TYPES;

  current: Document | null = null;
  name = '';
  type: DocumentType = 'Markdown';
  content = '';
  tags = '';

  @Output() saved = new EventEmitter<Document>();

  @Input()
  set document(value: Document | null) {
    this.current = value;
    this.name = value?.name ?? '';
    this.type = value?.type ?? 'Markdown';
    this.content = value?.content ?? '';
    this.tags = value?.tags?.join(', ') ?? '';
  }

  get isEditing(): boolean {
    return this.current !== null;
  }

  constructor(private readonly documents: DocumentService) {}

  save(): void {
    const tags = this.parseTags();

    if (this.current) {
      this.documents
        .update(this.current.id, {
          name: this.name,
          content: this.content,
          tags,
        })
        .subscribe((doc) => this.saved.emit(doc));
      return;
    }

    this.documents
      .create({
        name: this.name,
        type: this.type,
        content: this.content,
        tags,
      })
      .subscribe((doc) => this.saved.emit(doc));
  }

  private parseTags(): string[] {
    return this.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }
}
