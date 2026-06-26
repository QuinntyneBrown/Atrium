import { type Locator, type Page } from '@playwright/test';

/**
 * Page object for the chat + prompt-builder view (`/chat`).
 *
 * Wraps the model picker, the prompt-template builder, and the message stream
 * so specs can drive a conversation through intent-revealing helpers. The model
 * and template pickers are Angular Material `<mat-select>`s, which render their
 * options in a CDK overlay rather than as native `<option>`s.
 */
export class ChatPage {
  readonly page: Page;

  // Navigation
  readonly navChat: Locator;
  readonly navDocuments: Locator;

  // Conversation
  readonly modelSelect: Locator;
  readonly messages: Locator;
  readonly messageItems: Locator;
  readonly assistantMessages: Locator;
  readonly input: Locator;
  readonly sendButton: Locator;

  // Prompt builder
  readonly templateSelect: Locator;
  readonly promptBody: Locator;
  readonly promptPlaceholder: Locator;
  readonly runButton: Locator;

  // Document palette + drop zone (M4 drag-drop)
  readonly paletteDocuments: Locator;
  readonly promptDropzone: Locator;
  readonly attachedDocuments: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navChat = page.getByTestId('nav-chat');
    this.navDocuments = page.getByTestId('nav-documents');

    this.modelSelect = page.getByTestId('chat-model-select');
    this.messages = page.getByTestId('chat-messages');
    this.messageItems = page.getByTestId('chat-message');
    this.assistantMessages = page.getByTestId('chat-assistant-message');
    this.input = page.getByTestId('chat-input');
    this.sendButton = page.getByTestId('chat-send');

    this.templateSelect = page.getByTestId('prompt-template-select');
    this.promptBody = page.getByTestId('prompt-body');
    this.promptPlaceholder = page.getByTestId('prompt-placeholder');
    this.runButton = page.getByTestId('prompt-run');

    this.paletteDocuments = page.getByTestId('palette-document');
    this.promptDropzone = page.getByTestId('prompt-dropzone');
    this.attachedDocuments = page.getByTestId('attached-document');
  }

  /** Navigate to the chat view. */
  async goto(): Promise<void> {
    await this.page.goto('/chat');
  }

  /** Choose a prompt template from the `<mat-select>` overlay by exact name. */
  async selectTemplate(name: string): Promise<void> {
    await this.chooseOption(this.templateSelect, name);
  }

  /** Choose an Ollama model from the `<mat-select>` overlay by exact name. */
  async selectModel(name: string): Promise<void> {
    await this.chooseOption(this.modelSelect, name);
  }

  /** Type a message and send it. */
  async sendMessage(text: string): Promise<void> {
    await this.input.fill(text);
    await this.sendButton.click();
  }

  /**
   * Drag the palette document whose name matches onto the prompt-builder drop zone.
   * Uses manual pointer steps because Angular CDK drag-drop is driven by pointer events
   * (a single `dragTo` does not cross CDK's movement threshold).
   */
  async dragDocumentToPrompt(name: string): Promise<void> {
    const source = this.paletteDocuments.filter({ hasText: name }).first();
    await source.scrollIntoViewIfNeeded();

    const sourceBox = await source.boundingBox();
    const targetBox = await this.promptDropzone.boundingBox();
    if (!sourceBox || !targetBox) {
      throw new Error('palette item or drop zone is not visible');
    }

    const start = {
      x: sourceBox.x + sourceBox.width / 2,
      y: sourceBox.y + sourceBox.height / 2,
    };
    const end = {
      x: targetBox.x + targetBox.width / 2,
      y: targetBox.y + targetBox.height / 2,
    };

    await this.page.mouse.move(start.x, start.y);
    await this.page.mouse.down();
    await this.page.mouse.move(start.x + 8, start.y + 8); // cross the CDK drag threshold
    await this.page.mouse.move(end.x, end.y, { steps: 12 });
    await this.page.mouse.move(end.x, end.y);
    await this.page.mouse.up();
  }

  /** Open a `<mat-select>` and click the option matching `name` exactly. */
  private async chooseOption(trigger: Locator, name: string): Promise<void> {
    await trigger.click();
    await this.page.getByRole('option', { name, exact: true }).click();
  }
}
