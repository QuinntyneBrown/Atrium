import { test, expect } from '@playwright/test';
import { ChatPage } from '../pages/chat.page';

test('lists the built-in prompt templates', async ({ page }) => {
  const chat = new ChatPage(page);
  await chat.goto();

  // Open the prompt-template overlay and confirm the seeded ISO 42010 modes.
  await chat.templateSelect.click();

  for (const name of ['CHECK', 'CORRECT', 'AUTHOR']) {
    await expect(page.getByRole('option', { name, exact: true })).toBeVisible();
  }
});

test('streams a chat response', async ({ page }) => {
  test.skip(!process.env.ATRIUM_OLLAMA_UP, 'needs a running Ollama model');

  const chat = new ChatPage(page);
  await chat.goto();

  // A default model is expected to be preselected; if the build requires an
  // explicit choice, call `chat.selectModel('<model-name>')` here first.
  await chat.sendMessage('Say hello in one word');

  // The local model is small but slow, so allow a generous window for the
  // streamed response to produce any text.
  await expect(chat.assistantMessages.first()).not.toBeEmpty({ timeout: 60000 });
});
