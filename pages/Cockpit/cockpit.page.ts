import { Page, Locator } from '@playwright/test';

export class CockpitPage {
  constructor(private page: Page) {}

  async navigateToCockpitMenu(menuName: string) {
   await this.page.goto("/spaces");
   await this.page.getByRole("button", { name: "Cockpit" }).click();
   await this.page.getByRole("link", { name: menuName }).click();
  }

  async navigateToHome() {
    await this.page.getByText('Home').click();
  }

 
}
