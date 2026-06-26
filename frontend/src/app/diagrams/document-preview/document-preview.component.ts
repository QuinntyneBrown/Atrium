import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Document } from '../../documents/document.model';
import { DiagramPreviewComponent } from '../diagram-preview/diagram-preview.component';
import { DrawioPreviewComponent } from '../drawio-preview/drawio-preview.component';
import { MarkdownPreviewComponent } from '../markdown-preview/markdown-preview.component';

@Component({
  selector: 'app-document-preview',
  standalone: true,
  imports: [
    CommonModule,
    DiagramPreviewComponent,
    DrawioPreviewComponent,
    MarkdownPreviewComponent,
  ],
  templateUrl: './document-preview.component.html',
  styleUrl: './document-preview.component.scss',
})
export class DocumentPreviewComponent {
  @Input() document: Document | null = null;
}
