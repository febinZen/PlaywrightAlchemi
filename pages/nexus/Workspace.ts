import { expect, Locator, Page } from "@playwright/test";

/**
 * Workspace Page Object Model (Cockpit - Admin Only)
 * Encapsulates admin workspace operations inside the cockpit
 * Used for managing workspaces created by users
 */
export class WorkspacePage {
  // Navigation Locators
  private readonly cockpitBtn: Locator;
  private readonly workspacesLink: Locator;

  // Table Locators
  private readonly tableBody: Locator;

  constructor(private readonly page: Page) {
    // Navigation
    this.cockpitBtn = this.page.getByRole("button", { name: "Cockpit" });
    this.workspacesLink = this.page.getByRole("link", { name: "Workspaces" });

    // Table
    this.tableBody = this.page.locator("tbody");
  }

  /**
   * Navigate to cockpit workspaces section
   */
  async navigateToWorkspaces(): Promise<void> {
    await this.cockpitBtn.click();
    await this.workspacesLink.click();
  }

  /**
   * Get workspace row by name
   * Uses flexible text matching for reliability
   */
  private getWorkspaceRow(name: string): Locator {
    return this.tableBody.locator("tr").filter({ hasText: name }).first();
  }

  /**
   * Verify workspace appears in table
   */
  async expectWorkspaceInTable(name: string): Promise<void> {
    await expect(this.page.getByText(name).first()).toBeVisible();
    await expect(this.page.getByRole("cell", { name: name })).toBeVisible();
  }

  /**
   * Verify workspace exists in table body
   */
  async expectWorkspaceExists(name: string): Promise<void> {
    await expect(this.tableBody).toContainText(name);
  }

  /**
   * Open workspace actions menu
   */
  async openWorkspaceActions(name: string): Promise<void> {
    const row = this.getWorkspaceRow(name);
    await row.getByRole("button").click();
  }

  /**
   * Delete workspace
   */
  async deleteWorkspace(name: string): Promise<void> {
    await this.openWorkspaceActions(name);
    await this.page.getByRole("menuitem", { name: "Delete" }).click();
    await this.page.getByRole("button", { name: "Delete" }).click();
  }

  /**
   * Verify workspace is not in table
   */
  async expectWorkspaceNotInTable(name: string): Promise<void> {
    const row = this.getWorkspaceRow(name);
    await expect(row).toHaveCount(0);
  }
}
