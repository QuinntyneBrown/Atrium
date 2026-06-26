import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import {
  DOCUMENT_TYPES,
  Document,
  DocumentType,
} from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-repository',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './document-repository.component.html',
  styleUrl: './document-repository.component.scss',
})
export class DocumentRepositoryComponent implements OnInit {
  @Output() selectDocument = new EventEmitter<Document>();
  @Output() newDocument = new EventEmitter<void>();

  readonly types = DOCUMENT_TYPES;
  readonly displayedColumns = ['name', 'type', 'modifiedOnUtc', 'actions'];

  documents: Document[] = [];
  selectedType: DocumentType | '' = '';

  constructor(private readonly documents$: DocumentService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const type = this.selectedType || undefined;
    this.documents$.getAll(type).subscribe((docs) => (this.documents = docs));
  }

  onFilterChange(): void {
    this.load();
  }

  onSelect(document: Document): void {
    this.selectDocument.emit(document);
  }

  onNew(): void {
    this.newDocument.emit();
  }

  onDelete(document: Document, event: Event): void {
    event.stopPropagation();
    this.documents$.delete(document.id).subscribe(() => this.load());
  }
}
