import { Page, Locator } from "@playwright/test";



export class AccessPolicyPage {
  constructor(private page: Page) {}
  

  async navigate() {
    await this.page.goto("/spaces");
    await this.page.getByRole("button", { name: "Cockpit" }).click();
    await this.page.getByRole("link", { name: "Access Policies" }).click();
  }

  async openAiModelsSection(sectionName: string) {
    await this.page
      .getByRole("row", { name: sectionName })
      .getByRole("button")
      .click();
  }

  modelRow(modelName: string): Locator {
    return this.page.getByRole("row", {
      name: new RegExp(modelName, "i"),
    });
  }

  async toggleModel(modelName: string) {
    await this.modelRow(modelName).getByRole("switch").click();
  }

  async closeModal() {
    await this.page.getByRole("button", { name: "Close" }).click();
  }
}
