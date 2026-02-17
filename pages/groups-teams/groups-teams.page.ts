import { Page } from '@playwright/test';

export class GroupsTeamsPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/spaces');
    await this.page.getByRole('button', { name: 'Cockpit' }).click();
    await this.page.getByRole('link', { name: 'Groups & Teams' }).click();
  }

  groupRow(name: string) {
    return this.page.locator('tr').filter({ hasText: name }).first();
  }

  async clickCreateGroup() {
    await this.page.getByRole('button', { name: 'Create Group' }).click();
  }

  async clickCreateTeam() {
    await this.page.getByRole('button', { name: 'Create Team' }).click();
  }

  async selectOption(name: string) {
    await this.page.getByRole('option', { name }).click();
  }
}
