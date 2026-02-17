import { expect, Locator, Page } from "@playwright/test";

/**
 * Marketplace Page Object Model (Admin Only - Cockpit)
 * Comprehensive POM for admin marketplace operations inside the cockpit
 * Handles: navigation, listing creation, editing, publishing, deletion, and agent dropdown operations
 */
export class MarketplacePage {
  // Navigation Locators
  private readonly marketplaceLink: Locator;

  // Listing Creation Locators
  private readonly createListingBtn: Locator;
  private readonly agentCombobox: Locator;
  private readonly agentOption = (name: string) =>
    this.page.getByRole("option", { name });
  private readonly longDescriptionInput: Locator;
  private readonly authorNameInput: Locator;
  private readonly createListingConfirmBtn: Locator;
  private readonly cancelBtn: Locator;

  // Editing Locators
  private readonly titleInput: Locator;
  private readonly shortDescriptionInput: Locator;
  private readonly pricingCombobox: Locator;
  private readonly featuredSwitch: Locator;
  private readonly updateListingBtn: Locator;

  // Table Locators
  private readonly tableBody: Locator;

  constructor(private readonly page: Page) {
    // Navigation
    this.marketplaceLink = this.page.getByRole("link", { name: "MarketPlace" });

    // Listing Creation
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
    this.cancelBtn = this.page.getByRole("button", { name: "Cancel" });

    // Editing
    this.titleInput = this.page.getByRole("textbox", { name: "Title *" });
    this.shortDescriptionInput = this.page.getByRole("textbox", {
      name: "Short Description",
    });
    this.pricingCombobox = this.page
      .getByRole("combobox")
      .filter({ hasText: "Free" });
    this.featuredSwitch = this.page.getByRole("switch", {
      name: "Featured Listing",
    });
    this.updateListingBtn = this.page.getByRole("button", {
      name: "Update Listing",
    });

    // Table
    this.tableBody = this.page.locator("tbody");
  }

  /* ==================== NAVIGATION ==================== */

  /**
   * Navigate to marketplace link (inside cockpit)
   */
  async navigateToMarketplace(): Promise<void> {
    await this.marketplaceLink.click();
  }

  /* ==================== LISTING CREATION ==================== */

  /**
   * Start creating a listing
   */
  async startCreateListing(): Promise<void> {
    await expect(this.createListingBtn).toBeVisible();
    await this.createListingBtn.click();
  }

  /**
   * Open agent dropdown for selection
   */
  async openAgentDropdown(): Promise<void> {
    await this.agentCombobox.click();
  }

  /**
   * Select agent from dropdown by name
   */
  async selectAgent(agentName: string): Promise<void> {
    await this.openAgentDropdown();
    await this.agentOption(agentName).click();
  }

  /**
   * Fill long description field
   */
  async fillLongDescription(text: string): Promise<void> {
    await this.longDescriptionInput.click();
    await this.longDescriptionInput.fill(text);
  }

  /**
   * Fill author name field
   */
  async fillAuthorName(name: string): Promise<void> {
    await this.authorNameInput.click();
    await this.authorNameInput.fill(name);
  }

  /**
   * Create listing for an agent with optional details
   */
  async createListingForAgent(
    agentName: string,
    longDescription = "",
    authorName = "",
  ): Promise<void> {
    const option = this.agentOption(agentName);
    await expect(option).toBeVisible();
    await option.click();
    if (longDescription) await this.fillLongDescription(longDescription);
    if (authorName) await this.fillAuthorName(authorName);
    await this.createListingConfirmBtn.click();
    // wait for the listing to appear in the table
    await expect(this.tableBody).toContainText(agentName, { timeout: 15000 });
  }

  /**
   * Close listing creation modal
   */
  async closeListingModal(): Promise<void> {
    const overlay = this.page.locator(".fixed.inset-0");
    if (await overlay.isVisible()) {
      await overlay.click();
    }
    await this.cancelBtn.click();
  }

  /* ==================== LISTING OPERATIONS ==================== */

  /**
   * Get listing row by name
   */
  private getListingRowByName(name: string): Locator {
    return this.tableBody.locator("tr").filter({ hasText: name }).first();
  }

  /**
   * Edit listing with optional fields
   */
  async editListing(
    name: string,
    edits: {
      title?: string;
      shortDescription?: string;
      pricingOption?: string;
      featured?: boolean;
    },
  ): Promise<void> {
    const row = this.getListingRowByName(name);
    await row.getByRole("button").click();
    await this.page.getByRole("menuitem", { name: "Edit Listing" }).click();

    if (edits.title) {
      await this.titleInput.click();
      await this.titleInput.fill(edits.title);
    }
    if (edits.shortDescription) {
      await this.shortDescriptionInput.click();
      await this.shortDescriptionInput.fill(edits.shortDescription);
    }
    if (edits.pricingOption) {
      await this.pricingCombobox.click();
      await this.page
        .getByRole("option", { name: edits.pricingOption })
        .click();
    }
    if (edits.featured) {
      await this.featuredSwitch.click();
    }
    await this.updateListingBtn.click();
  }

  /**
   * Publish listing by name
   */
  async publishListing(name: string): Promise<void> {
    const row = this.getListingRowByName(name);
    await row.getByRole("button").click();
    await this.page.getByRole("menuitem", { name: "Publish" }).click();
  }

  /**
   * Delete listing permanently
   */
  async deleteListing(name: string): Promise<void> {
    const row = this.getListingRowByName(name);
    await expect(row).toHaveCount(1);
    await row.getByRole("button").first().click();
    await this.page
      .getByRole("menuitem", { name: "Delete Permanently" })
      .click();
    await this.page.getByRole("button", { name: "Delete" }).click();
  }

  /* ==================== ASSERTIONS ==================== */

  /**
   * Verify agent appears in listing dropdown
   */
  async expectAgentInDropdown(agentName: string): Promise<void> {
    const option = this.agentOption(agentName);
    await expect(option).toBeVisible();
  }

  /**
   * Verify agent does NOT appear in listing dropdown
   */
  async expectAgentNotInDropdown(agentName: string): Promise<void> {
    const option = this.agentOption(agentName);
    await expect(option).not.toBeVisible();
  }

  /**
   * Verify listing status
   */
  async expectListingStatus(name: string, status: string): Promise<void> {
    const row = this.getListingRowByName(name);
    const statusCell = row.locator("td").nth(3);
    await expect(statusCell).toContainText(status, { timeout: 5000 });
  }

  /**
   * Verify listing is not present
   */
  async expectListingNotPresent(name: string): Promise<void> {
    const row = this.getListingRowByName(name);
    await expect(row).toHaveCount(0);
  }
}
