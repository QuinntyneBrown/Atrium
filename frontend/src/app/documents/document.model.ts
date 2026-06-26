export type DocumentType = 'Puml' | 'Drawio' | 'Markdown';

export const DOCUMENT_TYPES: readonly DocumentType[] = [
  'Puml',
  'Drawio',
  'Markdown',
];

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  content: string;
  tags: string[];
  createdOnUtc: string;
  modifiedOnUtc: string;
}

export interface CreateDocumentRequest {
  name: string;
  type: DocumentType;
  content: string;
  tags: string[];
}

export interface UpdateDocumentRequest {
  name: string;
  content: string;
  tags: string[];
}
