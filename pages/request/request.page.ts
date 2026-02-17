import { Page } from '@playwright/test';

export class RequestPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/spaces');
    await this.page.getByRole('button', { name: 'Cockpit' }).click();
    await this.page.getByRole('link', { name: 'Requests' }).click();
  }

  openRequest(title: string) {
    return this.page.getByRole('row', { name: title });
  }

  commentBox() {
    return this.page.getByRole('textbox');
  }

  statusDropdown() {
    return this.page.getByRole('combobox');
  }
}
