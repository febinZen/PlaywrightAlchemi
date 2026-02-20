import { Page } from '@playwright/test';

export class NotificationTemplatePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/spaces');
    await this.page.getByRole('button', { name: 'Cockpit' }).click();
    await this.page
      .getByRole('link', { name: 'Notifications Templates' })
      .click();
  }

  headerButton(name: string) {
    return this.page.getByRole('button', { name });
  }

  searchBox() {
    return this.page.getByRole('textbox', { name: 'Search table' });
  }
}
