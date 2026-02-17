import { expect, Locator, Page } from "@playwright/test";

/**
 * Agent Page Object Model
 * Encapsulates all agent-related UI interactions and assertions
 * Follows industry-standard patterns with private locators and public action methods
 */
export class AgentPage {
  // Navigation Locators
  private readonly cockpitBtn: Locator;
  private readonly agentsLink: Locator;
  private readonly marketplaceLink: Locator;

  // Create Agent Form Locators
  private readonly createAgentBtn: Locator;
  private readonly agentNameInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly agentPromptInput: Locator;
  private readonly webSearchCheckbox: Locator;
  private readonly researchCheckbox: Locator;
  private readonly tagInput: Locator;
  private readonly addTagBtn: Locator;
  private readonly submitBtn: Locator;
  private readonly updateAgentBtn: Locator;
  private readonly cancelBtn: Locator;

  // Table & Row Locators
  private readonly agentsTable: Locator;
  private readonly agentsTableBody: Locator;

  // Marketplace Locators
  private readonly createListingBtn: Locator;
  private readonly agentCombobox: Locator;
  private readonly agentDropdown: Locator;

  // Dialogs & Confirmations
  private readonly deactivateConfirmBtn: Locator;
  private readonly reactivateConfirmBtn: Locator;
  private readonly deleteConfirmBtn: Locator;

  constructor(private readonly page: Page) {
    // Navigation
    this.cockpitBtn = this.page.getByRole("button", { name: "Cockpit" });
    this.agentsLink = this.page.getByRole("link", { name: "Agents" });
    this.marketplaceLink = this.page.getByRole("link", { name: "MarketPlace" });

    // Create Agent Form
    this.createAgentBtn = this.page.getByRole("button", {
      name: "Create Agent",
    });
    this.agentNameInput = this.page.getByRole("textbox", {
      name: "Agent Name *",
    });
    this.descriptionInput = this.page.getByRole("textbox", {
      name: "Description",
    });
    this.agentPromptInput = this.page.getByRole("textbox", {
      name: /Enter agent instructions/i,
    });
    this.webSearchCheckbox = this.page.getByRole("checkbox").first();
    this.researchCheckbox = this.page.getByRole("checkbox").nth(1);
    this.tagInput = this.page.getByRole("textbox", {
      name: "Type tag and press Enter",
    });
    this.addTagBtn = this.page
      .getByRole("button")
      .filter({ hasText: /^$/ })
      .first();
    this.submitBtn = this.page.getByRole("button", { name: "Create Agent" });
    this.updateAgentBtn = this.page.getByRole("button", {
      name: "Update Agent",
    });
    this.cancelBtn = this.page.getByRole("button", { name: "Cancel" });

    // Table
    this.agentsTable = this.page.locator("table");
    this.agentsTableBody = this.page.locator("tbody");

    // Marketplace
    this.createListingBtn = this.page.getByRole("button", {
      name: "Create Listing",
    });
    this.agentCombobox = this.page
      .getByRole("combobox")
      .filter({ hasText: "Select an agent" });
    this.agentDropdown = this.page.getByRole("listbox");

    // Confirmations
    this.deactivateConfirmBtn = this.page.getByRole("button", {
      name: "Deactivate",
    });
    this.reactivateConfirmBtn = this.page.getByRole("button", {
      name: "Reactivate",
    });
    this.deleteConfirmBtn = this.page.getByRole("button", {
      name: "Permanently Delete",
    });
  }

  /* ==================== PRIVATE HELPERS ==================== */

  /**
   * Get agent row by name from table
   * Uses flexible text matching for reliability
   */
  private getAgentRow(name: string): Locator {
    return this.agentsTableBody.locator("tr").filter({ hasText: name }).first();
  }

  /**
   * Open modal dropdown and close it
   */
  private async closeOverlay(): Promise<void> {
    const overlay = this.page.locator(".fixed.inset-0");
    if (await overlay.isVisible()) {
      await overlay.click();
    }
  }

  /* ==================== NAVIGATION ==================== */

  /**
   * Navigate to agents page from cockpit
   */
  async navigateToAgents(): Promise<void> {
    await this.cockpitBtn.click();
    await this.agentsLink.click();
    await expect(this.createAgentBtn).toBeVisible();
  }
  async navigateToAgents2(): Promise<void> {
    await this.agentsLink.click();
    await expect(this.createAgentBtn).toBeVisible();
  }

  /**
   * Navigate to marketplace
   */
  async navigateToMarketplace(): Promise<void> {
    await this.marketplaceLink.click();
  }

  /* ==================== AGENT CREATION ==================== */

  /**
   * Open create agent form
   */
  async openCreateForm(): Promise<void> {
    await this.createAgentBtn.click();
    await expect(this.agentNameInput).toBeVisible();
  }

  /**
   * Fill mandatory agent fields
   */
  async fillAgentName(name: string): Promise<void> {
    await this.agentNameInput.fill(name);
    await expect(this.submitBtn).toBeEnabled();
  }

  /**
   * Fill optional agent fields (description, system prompt, tags)
   */
  async fillAgentDetails(
    description?: string,
    systemPrompt?: string,
    tags?: string[],
  ): Promise<void> {
    if (description) {
      await this.descriptionInput.fill(description);
    }
    if (systemPrompt) {
      await this.agentPromptInput.fill(systemPrompt);
    }
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await this.tagInput.fill(tag);
        await this.addTagBtn.click();
      }
    }
  }

  /**
   * Enable optional capabilities (web search, research)
   */
  async enableCapabilities(): Promise<void> {
    await this.webSearchCheckbox.check();
    await this.researchCheckbox.check();
  }

  /**
   * Create agent with all provided data
   */
  async createAgent(
    name: string,
    description?: string,
    systemPrompt?: string,
    tags?: string[],
  ): Promise<void> {
    await this.openCreateForm();
    await this.fillAgentName(name);
    await this.fillAgentDetails(description, systemPrompt, tags);
    await this.enableCapabilities();
    await this.submitAgent();
  }

  /**
   * Submit create agent form
   */
  async submitAgent(): Promise<void> {
    await expect(this.submitBtn).toBeEnabled();
    await this.submitBtn.click();
  }

  /**
   * Cancel create agent form
   */
  async cancelCreateForm(): Promise<void> {
    await this.cancelBtn.click();
    await expect(this.createAgentBtn).toBeVisible();
  }

  /* ==================== AGENT EDITING ==================== */

  /**
   * Open edit form for agent by name
   */
  async openEditForm(agentName: string): Promise<void> {
    const agentRow = this.getAgentRow(agentName);
    await agentRow.getByRole("button").click();
    await this.page.getByRole("menuitem", { name: "Edit Agent" }).click();
    await expect(this.agentNameInput).toBeVisible();
  }

  /**
   * Update agent details
   */
  async updateAgent(newName: string, newDescription?: string): Promise<void> {
    await this.agentNameInput.fill(newName);
    if (newDescription) {
      await this.descriptionInput.fill(newDescription);
    }
    await expect(this.updateAgentBtn).toBeEnabled();
    await this.updateAgentBtn.click();
  }

  /* ==================== AGENT STATUS ==================== */

  /**
   * Deactivate agent by name
   */
  async deactivateAgent(agentName: string): Promise<void> {
    const agentRow = this.getAgentRow(agentName);
    await agentRow.getByRole("button").click();
    await this.page.getByRole("menuitem", { name: "Deactivate" }).click();
    await this.deactivateConfirmBtn.click();
  }

  /**
   * Reactivate agent by name
   */
  async reactivateAgent(agentName: string): Promise<void> {
    const agentRow = this.getAgentRow(agentName);
    await agentRow.getByRole("button").click();
    await this.page.getByRole("menuitem", { name: "Reactivate" }).click();
    await this.reactivateConfirmBtn.click();
  }

  /**
   * Delete agent permanently
   */
  async deleteAgent(agentName: string): Promise<void> {
    const agentRow = this.getAgentRow(agentName);
    await agentRow.getByRole("button").click();
    await this.page
      .getByRole("menuitem", { name: "Delete Permanently" })
      .click();
    await this.deleteConfirmBtn.click();
  }

  /* ==================== MARKETPLACE ==================== */

  /**
   * Create listing with specific agent
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
    await this.closeOverlay();
    await this.cancelBtn.click();
  }

  /* ==================== ASSERTIONS ==================== */

  /**
   * Verify agent exists by heading
   */
  async expectAgentExists(agentName: string): Promise<void> {
    const heading = this.page.getByRole("heading", { name: agentName });
    await expect(heading).toHaveCount(1);
    await expect(heading).toBeVisible();
  }

  /**
   * Verify agent appears in table
   */
  async expectAgentInTable(agentName: string): Promise<void> {
    await expect(this.agentsTableBody).toContainText(agentName);
  }

  /**
   * Verify agent status is active
   */
  async expectAgentActive(agentName: string): Promise<void> {
    const agentRow = this.getAgentRow(agentName);
    await expect(agentRow.getByText("Active")).toBeVisible();
  }

  /**
   * Verify agent status is inactive
   */
  async expectAgentInactive(agentName: string): Promise<void> {
    const agentRow = this.getAgentRow(agentName);
    await expect(agentRow.getByText("Inactive")).toBeVisible();
  }

  /**
   * Verify agent is removed from table
   */
  async expectAgentNotInTable(agentName: string): Promise<void> {
    const agentRow = this.getAgentRow(agentName);
    await expect(agentRow).toHaveCount(0);
  }

  /**
   * Verify agent does NOT appear in marketplace dropdown
   */
  async expectAgentNotInDropdown(agentName: string): Promise<void> {
    const option = this.page.getByRole("option", { name: agentName });
    await expect(option).not.toBeVisible();
  }

  /**
   * Verify agent appears in marketplace dropdown
   */
  async expectAgentInDropdown(agentName: string): Promise<void> {
    const option = this.page.getByRole("option", { name: agentName });
    await expect(option).toBeVisible();
  }
}
