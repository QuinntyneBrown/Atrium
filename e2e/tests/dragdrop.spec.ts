import { test, expect } from '@playwright/test';
import { ChatPage } from '../pages/chat.page';

test('drag a document from the palette attaches it to the prompt builder', async ({ page }) => {
  const chat = new ChatPage(page);
  await chat.goto();

  // context-pack.md is seeded as a default document, so it always appears in the palette.
  const contextPack = chat.paletteDocuments.filter({ hasText: 'context-pack.md' }).first();
  await expect(contextPack).toBeVisible();

  await chat.dragDocumentToPrompt('context-pack.md');

  await expect(
    chat.attachedDocuments.filter({ hasText: 'context-pack.md' }),
  ).toBeVisible();
});
