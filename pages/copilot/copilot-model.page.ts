import { Page, Locator } from '@playwright/test';

export class CopilotModelPage {
  constructor(private page: Page) {}

  async navigateToSpace(spaceName: string) {
    await this.page.getByRole('button', { name: 'Spaces', exact: true }).click();
    await this.page.getByRole('textbox', { name: 'Search your spaces...' }).click();
    await this.page.getByRole('textbox', { name: 'Search your spaces...' }).fill('Testing New');
    await this.page.getByRole('link', { name: spaceName }).click();
  }

  async openModelDropdown(modelButtonName: string) {
    await this.page.getByRole('button', {
      name: modelButtonName
    }).click();
  }

  modelOption(modelName: string): Locator {
    return this.page.getByRole('option', {
      name: new RegExp(modelName, 'i')
    });
  }

  async isModelVisible(modelName: string): Promise<boolean> {
    return await this.modelOption(modelName).count() > 0;
  }
}
