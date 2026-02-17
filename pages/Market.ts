import { expect, Locator, Page } from "@playwright/test";

/**
 * Market Page Object Model
 * Encapsulates marketplace UI interactions and assertions
 */
export class MarketPage {
  private readonly page: Page;

  // Controls
  private readonly createListingBtn: Locator;
  private readonly agentCombobox: Locator;
  private readonly agentOption = (name: string) =>
    this.page.getByRole("option", { name });
  private readonly longDescriptionInput: Locator;
  private readonly authorNameInput: Locator;
  private readonly createListingConfirmBtn: Locator;

  // Table
  private readonly tableBody: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createListingBtn = this.page.getByRole("button", {
      name: "Create Listing",
    });
    this.agentCombobox = this.page
      .getByRole("combobox")
      .filter({ hasText: "Select an agent" });
    this.longDescriptionInput = this.page.getByRole("textbox", {
      name: "Long Description",
    });
    this.authorNameInput = this.page.getByRole("textbox", {
      name: "Author Name",
    });
    this.createListingConfirmBtn = this.page.getByRole("button", {
      name: "Create Listing",
    });
    this.tableBody = this.page.locator("tbody");
  }

  async startCreateListing(): Promise<void> {
    await expect(this.createListingBtn).toBeVisible();
    await this.createListingBtn.click();
  }

  async openAgentDropdown(): Promise<void> {
    await this.agentCombobox.click();
  }

  async selectAgent(agentName: string): Promise<void> {
    await this.openAgentDropdown();
    await this.agentOption(agentName).click();
  }

  async fillLongDescription(text: string): Promise<void> {
    await this.longDescriptionInput.click();
    await this.longDescriptionInput.fill(text);
  }

  async fillAuthorName(name: string): Promise<void> {
    await this.authorNameInput.click();
    await this.authorNameInput.fill(name);
  }

  async createListingForAgent(
    agentName: string,
    longDescription = "",
    authorName = "",
  ): Promise<void> {
    // await this.startCreateListing();
    // await this.selectAgent(agentName);
    const option = this.page.getByRole("option", { name: agentName });
    await expect(option).toBeVisible();
    await option.click();
    if (longDescription) await this.fillLongDescription(longDescription);
    if (authorName) await this.fillAuthorName(authorName);
    await this.createListingConfirmBtn.click();
    // wait for the listing to appear in the table
    await expect(this.tableBody).toContainText(agentName, { timeout: 15000 });
  }

  getListingRowByName(name: string) {
    return this.tableBody.locator("tr").filter({ hasText: name }).first();
  }

  async expectListingStatus(name: string, status: string) {
    const row = this.getListingRowByName(name);
    const statusCell = row.locator("td").nth(3);
    await expect(statusCell).toContainText(status, { timeout: 5000 });
  }

  async editListing(
    name: string,
    edits: {
      title?: string;
      shortDescription?: string;
      pricingOption?: string;
      featured?: boolean;
    },
  ) {
    const row = this.getListingRowByName(name);
    await row.getByRole("button").click();
    await this.page.getByRole("menuitem", { name: "Edit Listing" }).click();
    if (edits.title) {
      await this.page.getByRole("textbox", { name: "Title *" }).click();
      await this.page
        .getByRole("textbox", { name: "Title *" })
        .fill(edits.title);
    }
    if (edits.shortDescription) {
      await this.page
        .getByRole("textbox", { name: "Short Description" })
        .click();
      await this.page
        .getByRole("textbox", { name: "Short Description" })
        .fill(edits.shortDescription);
    }
    if (edits.pricingOption) {
      await this.page.getByRole("combobox").filter({ hasText: "Free" }).click();
      await this.page
        .getByRole("option", { name: edits.pricingOption })
        .click();
    }
    if (edits.featured) {
      await this.page.getByRole("switch", { name: "Featured Listing" }).click();
    }
    await this.page.getByRole("button", { name: "Update Listing" }).click();
  }

  async publishListing(name: string) {
    const row = this.getListingRowByName(name);
    await row.getByRole("button").click();
    await this.page.getByRole("menuitem", { name: "Publish" }).click();
  }

  async deleteListing(name: string) {
    const row = this.getListingRowByName(name);
    await expect(row).toHaveCount(1);
    await row.getByRole("button").first().click();
    await this.page
      .getByRole("menuitem", { name: "Delete Permanently" })
      .click();
    await this.page.getByRole("button", { name: "Delete" }).click();
  }

  async expectListingNotPresent(name: string) {
    const row = this.getListingRowByName(name);
    await expect(row).toHaveCount(0);
  }
}
