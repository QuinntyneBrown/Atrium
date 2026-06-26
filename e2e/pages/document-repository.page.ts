import { type Locator, type Page } from '@playwright/test';

/** Shape of the data needed to author a new document via the editor. */
export interface NewDocument {
  name: string;
  /** Matches the type's option value or visible label (e.g. 'Markdown'). */
  type: string;
  content: string;
}

/**
 * Page object for the document repository view (`/documents`).
 *
 * Wraps the document list, the type filter, and the inline editor so specs can
 * drive CRUD flows through intent-revealing helpers rather than raw selectors.
 */
export class DocumentRepositoryPage {
  readonly page: Page;

  // List view
  readonly documentList: Locator;
  readonly documentRows: Locator;
  readonly newButton: Locator;
  readonly typeFilter: Locator;
  readonly deleteButton: Locator;

  // Editor
  readonly nameInput: Locator;
  readonly typeSelect: Locator;
  readonly contentInput: Locator;
  readonly saveButton: Locator;

  // Preview pane
  readonly documentPreview: Locator;
  readonly diagramSvg: Locator;
  readonly markdownPreview: Locator;
  readonly drawioPreview: Locator;

  constructor(page: Page) {
    this.page = page;

    this.documentList = page.getByTestId('document-list');
    this.documentRows = page.getByTestId('document-row');
    this.newButton = page.getByTestId('new-document');
    this.typeFilter = page.getByTestId('document-type-filter');
    this.deleteButton = page.getByTestId('delete-document');

    this.nameInput = page.getByTestId('document-name-input');
    this.typeSelect = page.getByTestId('document-type-select');
    this.contentInput = page.getByTestId('document-content-input');
    this.saveButton = page.getByTestId('save-document');

    this.documentPreview = page.getByTestId('document-preview');
    this.diagramSvg = page.getByTestId('diagram-svg');
    this.markdownPreview = page.getByTestId('markdown-preview');
    this.drawioPreview = page.getByTestId('drawio-preview');
  }

  /** Navigate to the document repository. */
  async goto(): Promise<void> {
    await this.page.goto('/documents');
  }

  /** Open the editor via the New button, populate it, and save. */
  async createDocument({ name, type, content }: NewDocument): Promise<void> {
    await this.newButton.click();
    await this.nameInput.fill(name);
    await this.selectType(type);
    await this.contentInput.fill(content);
    await this.saveButton.click();
  }

  /**
   * Drives the editor's Angular Material `<mat-select>` (which renders its options
   * in a CDK overlay — a native `selectOption` does not work on it).
   */
  async selectType(type: string): Promise<void> {
    await this.typeSelect.click();
    await this.page.getByRole('option', { name: type, exact: true }).click();
  }

  /** Delete the row whose name matches, via that row's per-row delete button. */
  async deleteDocument(name: string): Promise<void> {
    await this.rowByName(name).getByTestId('delete-document').click();
  }

  /** Number of rows currently rendered in the list. */
  async rowCount(): Promise<number> {
    return this.documentRows.count();
  }

  /** Rows whose `document-name` cell contains the given name. */
  rowByName(name: string): Locator {
    return this.documentRows.filter({
      has: this.page.getByTestId('document-name').filter({ hasText: name }),
    });
  }

  /** Select the named document so its content renders in the preview pane. */
  async selectDocument(name: string): Promise<void> {
    await this.rowByName(name).click();
  }
}
