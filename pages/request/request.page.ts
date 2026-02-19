import { Page, Locator } from "@playwright/test";

export class CockpitRequestPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("/spaces");
    await this.page.getByRole("button", { name: "Cockpit" }).click();
    await this.page.getByRole("link", { name: "Requests" }).click();
  }

  async openRequest(subject: string) {
    await this.requestRow(subject).getByRole("link").click();
  }

  priorityButton(): Locator {
    return this.page.getByRole("button", {
      name: /low|high|important|urgent/i,
    });
  }

  async getCurrentPriority(): Promise<string> {
    const text = await this.priorityButton().textContent();
    return text?.trim() || "";
  }

  async changePriority(newPriority: string) {
    await this.priorityButton().click();
    await this.page
      .getByRole("menuitem", {
        name: newPriority,
      })
      .click();
  }

  async goBack() {
    await this.page.getByRole("button", { name: "Go back" }).click();
  }

  async getPriorityFromTable(subject: string): Promise<string> {
    const row = this.requestRow(subject);
    return (await row.textContent()) || "";
  }

  async searchRequest(subject: string) {
    await this.page.getByRole("textbox", { name: "Search table" }).click();
    await this.page
      .getByRole("textbox", { name: "Search table" })
      .fill(subject);
  }

  async isRequestInTable(subject: string): Promise<boolean> {
    const row = this.requestRow(subject);
    await this.page.waitForTimeout(500); // allow table refresh
    return (await row.count()) > 0;
  }

  commentBox() {
    return this.page.getByRole("textbox");
  }

  statusDropdown() {
    return this.page.getByRole("combobox");
  }

  requestRow(subject: string): Locator {
    return this.page
      .locator("tbody tr")
      .filter({
        has: this.page.getByText(subject, { exact: false }),
      })
      .first();
  }
}
