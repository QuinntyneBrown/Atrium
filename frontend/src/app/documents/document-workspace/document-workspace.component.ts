import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { Document } from '../document.model';
import { DocumentEditorComponent } from '../document-editor/document-editor.component';
import { DocumentRepositoryComponent } from '../document-repository/document-repository.component';
import { DocumentPreviewComponent } from '../../diagrams/document-preview/document-preview.component';

@Component({
  selector: 'app-document-workspace',
  standalone: true,
  imports: [
    CommonModule,
    DocumentRepositoryComponent,
    DocumentEditorComponent,
    DocumentPreviewComponent,
  ],
  templateUrl: './document-workspace.component.html',
  styleUrl: './document-workspace.component.scss',
})
export class DocumentWorkspaceComponent {
  @ViewChild(DocumentRepositoryComponent)
  private repository?: DocumentRepositoryComponent;

  selected: Document | null = null;

  onSelect(document: Document): void {
    this.selected = document;
  }

  onNew(): void {
    this.selected = null;
  }

  onSaved(): void {
    this.repository?.load();
  }
}
