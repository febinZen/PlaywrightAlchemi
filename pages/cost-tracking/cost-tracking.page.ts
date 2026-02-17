import { Page } from '@playwright/test';

export class CostTrackingPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/spaces');
    await this.page.getByRole('button', { name: 'Cockpit' }).click();
    await this.page.getByRole('link', { name: 'Cost Tracking' }).click();
  }

  metricButton(name: string) {
    return this.page.getByRole('button', { name });
  }

  dropdown(index: number = 0) {
    return this.page.getByRole('combobox').nth(index);
  }

  searchBox() {
    return this.page.getByRole('textbox', { name: 'Search table' });
  }

  clearSearch() {
    return this.page.getByRole('button', { name: 'Clear search' });
  }
}
