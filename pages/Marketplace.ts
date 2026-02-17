import { expect, Locator, Page } from "@playwright/test";

/**
 * Marketplace Page Object Model
 * Encapsulates all user-facing marketplace interactions
 * Used for verifying published agents and marketplace visibility
 */
export class MarketplacePage {
  // Navigation Locators
  private readonly marketplaceBtn: Locator;
  private readonly marketplaceLink: Locator;

  // User Search Locators
  private readonly searchBox: Locator;
  private readonly welcomeTourLocator: Locator;
  private readonly noItemsFoundHeading: Locator;
  private readonly itemCountText: Locator;

  // Admin Listing Creation Locators
  private readonly createListingBtn: Locator;
  private readonly agentCombobox: Locator;
  private readonly agentDropdown: Locator;
  private readonly cancelBtn: Locator;

  constructor(private readonly page: Page) {
    // Navigation
    this.marketplaceBtn = this.page.getByRole("button", { name: "Marketplace" });
    this.marketplaceLink = this.page.getByRole("link", { name: "MarketPlace" });

    // User Search
    this.searchBox = this.page.getByRole("textbox", {
      name: "Search marketplace...",
    });
    this.welcomeTourLocator = this.page.locator("#welcome-tour");
    this.noItemsFoundHeading = this.page.getByRole("heading", {
      name: "No items found",
    });
    this.itemCountText = this.page.getByText("0");

    // Admin Listing Creation
    this.createListingBtn = this.page.getByRole("button", {
      name: "Create Listing",
    });
    this.agentCombobox = this.page
      .getByRole("combobox")
      .filter({ hasText: "Select an agent" });
    this.agentDropdown = this.page.getByRole("listbox");
    this.cancelBtn = this.page.getByRole("button", { name: "Cancel" });
  }

  /**
   * Navigate to spaces page
   */
  async goToSpaces(): Promise<void> {
    await this.page.goto("/spaces");
  }

  /**
   * Open marketplace via button
   */
  async openMarketplace(): Promise<void> {
    await this.marketplaceBtn.click();
  }

  /**
   * Navigate to marketplace link
   */
  async navigateToMarketplace(): Promise<void> {
    await this.marketplaceLink.click();
  }

  /**
   * Search for an agent in the marketplace
   */
  async searchAgent(agentName: string): Promise<void> {
    await this.searchBox.click();
    await this.searchBox.fill(agentName);
  }

  /**
   * Verify agent is NOT visible in marketplace
   * Searches for the agent and verifies "No items found" message
   */
  async verifyAgentNotFound(agentName: string): Promise<void> {
    await this.goToSpaces();
    await this.openMarketplace();
    await this.searchAgent(agentName);
    await expect(this.itemCountText).toBeVisible();
    await expect(this.welcomeTourLocator).toContainText("0");
    await expect(this.noItemsFoundHeading).toBeVisible();
  }

  /* ==================== ADMIN LISTING OPERATIONS ==================== */

  /**
   * Start creating a listing
   */
  async startCreateListing(): Promise<void> {
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
  async selectAgentFromDropdown(agentName: string): Promise<void> {
    await this.openAgentDropdown();
    await this.page.getByRole("option", { name: agentName }).click();
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

  /**
   * Verify agent appears in listing dropdown
   */
  async expectAgentInDropdown(agentName: string): Promise<void> {
    const option = this.page.getByRole("option", { name: agentName });
    await expect(option).toBeVisible();
  }

  /**
   * Verify agent does NOT appear in listing dropdown
   */
  async expectAgentNotInDropdown(agentName: string): Promise<void> {
    const option = this.page.getByRole("option", { name: agentName });
    await expect(option).not.toBeVisible();
  }
}
