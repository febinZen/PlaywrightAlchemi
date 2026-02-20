import { Page } from '@playwright/test';

export class UserRequestPage {
  constructor(private page: Page) {}

  async openHelpAndSupport() {
    await this.page.locator('#tour-complete-jride').click();
  }

  async selectType(type: string) {
    await this.page.getByRole('combobox', { name: 'Type' }).click();
    await this.page.getByRole('option', { name: type }).click();
  }

  async fillSubject(subject: string) {
    await this.page.getByRole('textbox', { name: 'Subject' })
      .fill(subject);
  }

  async fillDescription(description: string) {
    await this.page.getByRole('textbox', { name: 'Description / Credit' })
      .fill(description);
  }

  async fillCredits(credits: number) {
    const creditInput = this.page.getByRole('spinbutton', {
      name: 'Credits'
    });

    await creditInput.fill(credits.toString());
  }

  async submit() {
    await this.page.getByRole('button', {
      name: 'Submit Credit Request'
    }).click();
  }

  async goToSpaces() {
    await this.page.goto('/spaces');
  }
}
