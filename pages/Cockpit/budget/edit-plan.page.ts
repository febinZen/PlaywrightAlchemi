import { Page } from '@playwright/test';

export class EditPlanPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.getByRole('button', { name: 'Edit Plan' }).click();
  }

  planNameInput() {
    return this.page.getByRole('textbox', { name: 'Plan Name' });
  }

  creditsInput() {
    return this.page.getByRole('spinbutton', {
      name: 'Credits to Distribute'
    });
  }

  dropdown() {
    return this.page.getByRole('combobox');
  }

  capInput() {
    return this.page.getByPlaceholder('Cap amount');
  }

  continueButton() {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  backButton() {
    return this.page.getByRole('button', { name: 'Back', exact: true });
  }

  saveButton() {
    return this.page.getByRole('button', { name: 'Save Changes' });
  }

  skipButton() {
    return this.page.getByRole('button', { name: 'Skip' });
  }
}
