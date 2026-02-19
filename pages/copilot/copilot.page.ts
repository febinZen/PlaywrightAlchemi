import { Page, Locator } from '@playwright/test';

export class CopilotPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToChat() {
    await this.page.getByRole('button', { name: 'Spaces', exact: true }).click();
    await this.page.getByRole('button', { name: 'Create Space' }).click();
    await this.page.getByRole('textbox', { name: 'Space Name *' }).click();
    await this.page.getByRole('textbox', { name: 'Space Name *' }).fill('Credits');
    await this.page.getByRole('textbox', { name: 'Description' }).click();
    await this.page.getByRole('textbox', { name: 'Description' }).fill('let\'s go');
    await this.page.getByRole('button', { name: 'Create Space' }).click();
  }

  chatInput(): Locator {
    return this.page.getByRole('textbox', {
      name: 'What would you like to work'
    });
  }

  async startChat(message: string) {
    await this.chatInput().click();
    await this.chatInput().fill(message);
    await this.page.getByRole('button', { name: 'Start Chat' }).click();
  }

  creditDisplay(): Locator {
    return this.page.locator('text=/\\d+\\s*\\/\\s*\\d+/');
  }

  async getCreditText(): Promise<string> {
    return (await this.creditDisplay().textContent())?.trim() || '';
  }
}
