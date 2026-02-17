import { Page, Locator } from '@playwright/test';

export class BudgetPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/spaces');
    await this.page.getByRole('button', { name: 'Cockpit' }).click();
    await this.page.getByRole('link', { name: 'Budgets' }).click();
  }

  groupRow(name: string): Locator {
    return this.page.locator('tr').filter({ hasText: name }).first();
  }

  memberRow(name: string): Locator {
    return this.page.locator('tr').filter({ hasText: name }).first();
  }

  async clickEditForRow(name: string) {
    await this.groupRow(name).getByRole('button').nth(1).click();
  }

  spendingInput(): Locator {
    return this.page.getByRole('spinbutton', {
      name: 'Spending Limit (Credits)'
    });
  }

  overflowDropdown(): Locator {
    return this.page.getByRole('combobox');
  }

  overflowCapInput(): Locator {
    return this.page.getByRole('spinbutton', {
      name: 'Overflow Cap (Credits)'
    });
  }

  async clickUpdate() {
    await this.page.getByRole('button', { name: 'Update' }).click();
  }

  async clickCancel() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }

  async clickRemove() {
    await this.page.getByRole('button', { name: 'Remove' }).click();
  }

  async confirmIfVisible() {
    const confirm = this.page.getByRole('button', { name: /confirm|yes/i });
    if (await confirm.isVisible()) await confirm.click();
  }
}
