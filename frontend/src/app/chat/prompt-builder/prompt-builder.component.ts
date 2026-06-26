import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { PromptTemplate } from '../prompt-template.model';
import { PromptTemplateService } from '../prompt-template.service';

@Component({
  selector: 'app-prompt-builder',
  standalone: true,
  imports: [
    CdkDropList,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './prompt-builder.component.html',
  styleUrl: './prompt-builder.component.scss',
})
export class PromptBuilderComponent implements OnInit {
  @Output() assembled = new EventEmitter<string>();

  templates: PromptTemplate[] = [];
  selectedTemplate?: PromptTemplate;
  placeholders: string[] = [];
  values: Record<string, string> = {};
  attached: string[] = [];
  customName = '';

  constructor(private readonly templateService: PromptTemplateService) {}

  /** Drop handler: a document dragged from the palette fills the {{document}} context. */
  onDocumentDropped(event: CdkDragDrop<unknown>): void {
    const dropped = event.item.data as { name: string; content: string } | undefined;
    if (dropped) {
      this.attachDocument(dropped);
    }
  }

  attachDocument(document: { name: string; content: string }): void {
    const existing = this.values['document'];
    this.values['document'] = existing
      ? `${existing}\n\n${document.content}`
      : document.content;

    if (!this.placeholders.includes('document')) {
      this.placeholders = [...this.placeholders, 'document'];
    }
    if (!this.attached.includes(document.name)) {
      this.attached = [...this.attached, document.name];
    }
  }

  ngOnInit(): void {
    this.templateService.getAll().subscribe((templates) => (this.templates = templates));
  }

  selectTemplate(template: PromptTemplate): void {
    this.selectedTemplate = template;
    this.placeholders = this.extractPlaceholders(template.body);
    this.values = {};
    // Clear attachments too — keeping the chips while wiping values['document'] would show
    // documents as attached whose content is no longer in the assembled prompt.
    this.attached = [];
    for (const placeholder of this.placeholders) {
      this.values[placeholder] = '';
    }
  }

  /** Substitute the filled placeholders into the template body and hand it to the chat. */
  run(): void {
    if (this.selectedTemplate) {
      this.assembled.emit(this.assemble(this.selectedTemplate.body));
    }
  }

  saveAsCustom(): void {
    const name = this.customName.trim();
    if (!this.selectedTemplate || !name) {
      return;
    }

    this.templateService
      .create({ name, mode: 'Custom', body: this.selectedTemplate.body })
      .subscribe((created) => {
        this.templates = [...this.templates, created];
        this.customName = '';
      });
  }

  private assemble(body: string): string {
    return body.replace(this.placeholderPattern(), (_match, name: string) => this.values[name] ?? '');
  }

  private extractPlaceholders(body: string): string[] {
    const found: string[] = [];
    for (const match of body.matchAll(this.placeholderPattern())) {
      const name = match[1];
      if (!found.includes(name)) {
        found.push(name);
      }
    }
    return found;
  }

  private placeholderPattern(): RegExp {
    return /\{\{\s*([\w.-]+)\s*\}\}/g;
  }
}
