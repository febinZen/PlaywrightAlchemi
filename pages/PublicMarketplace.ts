import { expect, Locator, Page } from "@playwright/test";

/**
 * Public Marketplace Page Object Model
 * Encapsulates all public marketplace interactions
 * Accessible by both admin and regular users outside of cockpit
 * Used for browsing and searching published agents
 */
export class PublicMarketplacePage {
  // Navigation Locators
  private readonly marketplaceBtn: Locator;
  private readonly marketplaceLink: Locator;

  // User Search Locators
  private readonly searchBox: Locator;
  private readonly welcomeTourLocator: Locator;
  private readonly noItemsFoundHeading: Locator;
  private readonly itemCountText: Locator;

  constructor(private readonly page: Page) {
    // Navigation
    this.marketplaceBtn = this.page.getByRole("button", {
      name: "Marketplace",
    });
    this.marketplaceLink = this.page.getByRole("link", { name: "MarketPlace" });

    // Search
    this.searchBox = this.page.getByRole("textbox", {
      name: "Search marketplace...",
    });
    this.welcomeTourLocator = this.page.locator("#welcome-tour");
    this.noItemsFoundHeading = this.page.getByRole("heading", {
      name: "No items found",
    });
    this.itemCountText = this.page.getByText("0");
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
   * Navigate to marketplace via link
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
   * Verify agent is NOT visible in public marketplace
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

  /**
   * Verify agent is found in public marketplace
   * Searches for the agent and verifies it appears
   */
  async verifyAgentFound(agentName: string): Promise<void> {
    await this.goToSpaces();
    await this.openMarketplace();
    await this.searchAgent(agentName);
    await expect(
      this.page.getByRole("heading", { name: agentName }),
    ).toBeVisible();
  }
}
