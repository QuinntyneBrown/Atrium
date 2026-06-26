import { test, expect } from '@playwright/test';
import { DocumentRepositoryPage } from '../pages/document-repository.page';

/** A name unlikely to collide with existing rows or other test runs. */
function uniqueName(prefix: string): string {
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

test('creates and lists a document', async ({ page }) => {
  const documents = new DocumentRepositoryPage(page);
  await documents.goto();

  const name = uniqueName('E2E Markdown Doc');
  await documents.createDocument({
    name,
    type: 'Markdown',
    content: '# Heading\n\nCreated by the e2e suite.',
  });

  await expect(documents.rowByName(name)).toHaveCount(1);
  await expect(documents.rowByName(name)).toBeVisible();
});

test('deletes a document', async ({ page }) => {
  const documents = new DocumentRepositoryPage(page);
  await documents.goto();

  const name = uniqueName('E2E Doc To Delete');
  await documents.createDocument({
    name,
    type: 'Markdown',
    content: 'Transient document.',
  });
  await expect(documents.rowByName(name)).toBeVisible();

  // Delete via the row's own delete button (delete is per-row).
  await documents.deleteDocument(name);

  await expect(documents.rowByName(name)).toHaveCount(0);
});
