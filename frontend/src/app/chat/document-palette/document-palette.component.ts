import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { Document } from '../../documents/document.model';
import { DocumentService } from '../../documents/document.service';

/**
 * A draggable list of repository documents. Drag an item onto the prompt builder's drop zone
 * to attach its content to the assembled prompt (M4). The seeded context-pack.md appears here
 * by default.
 */
@Component({
  selector: 'app-document-palette',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, MatIconModule],
  templateUrl: './document-palette.component.html',
  styleUrl: './document-palette.component.scss',
})
export class DocumentPaletteComponent implements OnInit {
  documents: Document[] = [];

  constructor(private readonly documentService: DocumentService) {}

  ngOnInit(): void {
    this.documentService.getAll().subscribe((documents) => (this.documents = documents));
  }
}
