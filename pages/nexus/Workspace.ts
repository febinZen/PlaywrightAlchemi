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

  /**
   * Rename workspace
   */
  async renameWorkspace(name: string, newName: string): Promise<void> {
    const row = this.getWorkspaceRow(name);
    await row.getByRole("button").click();
    await this.page.getByRole("menuitem", { name: "Rename" }).click();
    await this.page
      .getByRole("textbox", { name: "Enter New Workspace Name" })
      .click();
    await this.page
      .getByRole("textbox", { name: "Enter New Workspace Name" })
      .fill(newName);
    await this.page.getByRole("button", { name: "Rename" }).click();
  }

  /**
   * Archive workspace
   */
  async archiveWorkspace(name: string): Promise<void> {
    const row = this.getWorkspaceRow(name);
    await row.getByRole("button").click();
    await this.page.getByRole("menuitem", { name: "Archive" }).click();
    await this.page.getByRole("button", { name: "Archive" }).click();
  }

  /**
   * Verify workspace is archived
   */
  async expectWorkspaceArchived(name: string): Promise<void> {
    const row = this.getWorkspaceRow(name);
    await expect(row.locator("td").nth(1)).toHaveText(/ARCHIVED/i);
  }

  async UnArchiveWorkspace(name: string): Promise<void> {
    const row = this.getWorkspaceRow(name);
    await row.getByRole("button").click();
    await this.page.getByRole("menuitem", { name: "Restore" }).click();
    await this.page.getByRole("button", { name: "Restore" }).click();
  }
  async reloadPage(): Promise<void> {
    await this.page.reload({ waitUntil: "networkidle" });
  }
  async expectUnArchiveWorkspace(name: string): Promise<void> {
    await this.reloadPage();
    const row = this.getWorkspaceRow(name);
    // const statusCell = row.locator("td").nth(1);
    await expect(row.locator("td").nth(1)).toHaveText(/ACTIVE/i);
  }
  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  async selectUser(name: string): Promise<void> {
    await this.page
      .getByRole("button", {
        name: new RegExp(`^${this.escapeRegex(name)}`, "i"),
      })
      .click();
  }

  async shareWorkspace(name: string, member: string): Promise<void> {
    const row = this.getWorkspaceRow(name);
    await row.getByRole("button").click();
    await this.page.getByRole("menuitem", { name: "Share" }).click();
    await this.page
      .getByRole("textbox", { name: "Search users to add" })
      .click();
    await this.page
      .getByRole("textbox", { name: "Search users to add" })
      .fill(member);
    await this.selectUser(member);
    await this.page.getByText("Users (1 selected)").click();
    await this.page.getByRole("combobox", { name: "Role" }).click();
    await this.page.getByRole("option", { name: "OWNER" }).click();
    await this.page.getByRole("button", { name: "Add Member" }).click();
  }
}
