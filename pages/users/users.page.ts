import { Page } from '@playwright/test';

export class UsersPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/spaces');
    await this.page.getByRole('button', { name: 'Cockpit' }).click();
    await this.page.getByRole('link', { name: 'Users' }).click();
  }

  headerButton(name: string) {
    return this.page.getByRole('button', { name });
  }

  dropdown() {
    return this.page.getByRole('combobox');
  }

  searchBox() {
    return this.page.getByRole('textbox', { name: 'Search table' });
  }
}
