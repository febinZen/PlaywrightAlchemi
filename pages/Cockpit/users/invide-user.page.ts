import { Page, expect } from '@playwright/test';

export class UserTablePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

 

  async goToInvites() {
    await this.page.getByRole('link', { name: 'Invites' }).click();
  }

  // Invite User
  async clickInviteUser() {
    await this.page.getByRole('button', { name: 'Invite User' }).click();
  }
  async clickCancel(){
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }

  async fillEmail(email: string) {
    const emailTextbox = this.page.getByRole('textbox', { name: 'Email' });
    await emailTextbox.fill(email);
    await emailTextbox.press('Tab');
  }

  async selectRole(role: string) {
    await this.page.getByRole('combobox', { name: 'Role' }).click();
    await this.page.getByRole('option', { name: role }).click();
  }

  async sendInvitation() {
    await this.page.getByRole('button', { name: 'Send Invitation' }).click();
  }

  // Accept Invite
  async acceptInvite(email: string) {
    await this.page.getByText(email).first().click();
    await this.page.locator('[id^="radix-"]').click();
    await this.page
      .getByRole('menuitem', { name: /Accept/i })
      .locator('div')
      .first()
      .click();

    await this.page.getByRole('button', { name: 'Confirm Accept' }).click();
  }

  // Reject Invite
  async rejectInvite(rowName: string) {
    const row = this.page.getByRole('row', { name: rowName });
    await row.getByRole('button').click();

    await this.page
      .getByRole('menuitem', { name: /Reject/i })
      .locator('div')
      .first()
      .click();

    await this.page.getByRole('button', { name: 'Confirm Reject' }).click();
  }

  async verifyUserVisible(email: string) {
    await expect(this.page.getByText(email).first()).toBeVisible();
  }
}