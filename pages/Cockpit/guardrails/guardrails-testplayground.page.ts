import { Page, expect } from "@playwright/test";

export class GuardrailsPage {

  constructor(private page: Page) {}

  async openTestPlayground() {

    await this.page.getByRole("link", { name: "Guardrails" }).click();
    await this.page.getByRole("link", { name: "Test Playground" }).click();

  }

  async selectSample(sampleName: string) {

    await this.page.getByRole("button", { name: sampleName }).click();

  }

  async toggleCheckbox(name: string) {

    await this.page.getByRole("checkbox", { name }).click();

  }

  async toggleGuardrails(allowedCheckbox: string, allCheckboxes: string[]) {

  for (const checkbox of allCheckboxes) {

    const locator = this.page.getByRole("checkbox", { name: checkbox });

    const isChecked = await locator.isChecked();

    if (checkbox === allowedCheckbox) {

      if (!isChecked) {
        await locator.click();
      }

    } else {

      if (isChecked) {
        await locator.click();
      }

    }

  }

}

  async runTest() {

    await this.page.getByRole("button", { name: "Run Test" }).click();

  }

  async clearInput() {

    await this.page.getByRole("button", { name: "Clear" }).click();

  }

  async validateResult(ruleName: string, expected: string) {

    const regex = new RegExp(`${ruleName}.*${expected}`, "i");

    await expect(this.page.getByText(regex)).toBeVisible();

  }

  async validateOverall(expected: string) {

    const regex = new RegExp(`Overall:${expected}`, "i");

    await expect(this.page.getByText(regex)).toBeVisible();

  }

}