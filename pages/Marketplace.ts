import { expect, Locator, Page } from "@playwright/test";

/**
 * Marketplace Page Object Model (Cockpit - Admin Only)
 * Encapsulates admin-only marketplace/listing operations inside the cockpit
 * Used for creating, editing, and publishing agent listings
 */
export class MarketplacePage {
  // Navigation Locators
  private readonly marketplaceLink: Locator;

  // Admin Listing Creation Locators
  private readonly createListingBtn: Locator;
  private readonly agentCombobox: Locator;
  private readonly agentDropdown: Locator;
  private readonly cancelBtn: Locator;

  constructor(private readonly page: Page) {
    // Navigation
    this.marketplaceLink = this.page.getByRole("link", { name: "MarketPlace" });

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
   * Navigate to marketplace link (inside cockpit)
   */
  async navigateToMarketplace(): Promise<void> {
    await this.marketplaceLink.click();
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
