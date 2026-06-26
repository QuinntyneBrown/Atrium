import { test, expect } from '@playwright/test';
import { DocumentRepositoryPage } from '../pages/document-repository.page';

/** A name unlikely to collide with existing rows or other test runs. */
function uniqueName(prefix: string): string {
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

test('renders a markdown preview', async ({ page }) => {
  const documents = new DocumentRepositoryPage(page);
  await documents.goto();

  const name = uniqueName('E2E Preview Markdown');
  await documents.createDocument({
    name,
    type: 'Markdown',
    content: '# PreviewHeading\n\nRendered by the e2e suite.',
  });

  await documents.selectDocument(name);

  await expect(documents.markdownPreview).toBeVisible();
  await expect(documents.markdownPreview).toContainText('PreviewHeading');
});

test('renders a live PlantUML diagram', async ({ page }) => {
  test.skip(!process.env.ATRIUM_DOCKER_UP, 'needs the dockerised plantuml-server');

  const documents = new DocumentRepositoryPage(page);
  await documents.goto();

  const name = uniqueName('E2E Preview Puml');
  await documents.createDocument({
    name,
    type: 'Puml',
    content: '@startuml\nA -> B\n@enduml',
  });

  await documents.selectDocument(name);

  // The diagram is rendered server-side by plantuml-server, so allow a
  // generous timeout for the round-trip before the <svg> appears.
  await expect(documents.diagramSvg.locator('svg')).toBeVisible({ timeout: 15000 });
});
