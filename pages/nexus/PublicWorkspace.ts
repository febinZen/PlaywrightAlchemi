import { expect, Locator, Page } from "@playwright/test";

/**
 * Public Workspace Page Object Model
 * Encapsulates public workspace operations accessible by users
 * Used for creating, viewing, and managing workspaces outside of cockpit
 */
export class PublicWorkspacePage {
  // Navigation Locators
  private readonly spacesBtn: Locator;
  private readonly createSpaceBtn: Locator;
  private readonly backBtn: Locator;

  // Form Locators
  private readonly spaceNameInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly workspaceTypeCombobox: Locator;

  constructor(private readonly page: Page) {
    // Navigation
    this.spacesBtn = this.page.getByRole("button", {
      name: "Spaces",
      exact: true,
    });
    this.createSpaceBtn = this.page.getByRole("button", {
      name: "Create Space",
    });
    this.backBtn = this.page.getByRole("button", { name: "Back" });

    // Form
    this.spaceNameInput = this.page.getByRole("textbox", {
      name: "Space Name *",
    });
    this.descriptionInput = this.page.getByRole("textbox", {
      name: "Description",
    });
    this.workspaceTypeCombobox = this.page.getByRole("combobox", {
      name: "Select workspace type",
    });
  }

  /**
   * Navigate to spaces
   */
  async navigateToSpaces(): Promise<void> {
    await this.spacesBtn.click();
  }

  /**
   * Open create space form
   */
  async openCreateSpaceForm(): Promise<void> {
    await this.createSpaceBtn.click();
  }

  /**
   * Fill space name
   */
  async fillSpaceName(name: string): Promise<void> {
    await this.spaceNameInput.click();
    await this.spaceNameInput.fill(name);
  }

  /**
   * Fill description
   */
  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.click();
    await this.descriptionInput.fill(description);
  }

  /**
   * Select workspace type from dropdown
   */
  async selectWorkspaceType(type: string): Promise<void> {
    await this.workspaceTypeCombobox.click();
    await this.page.getByRole("option", { name: type }).click();
  }

  /**
   * Submit create space form
   */
  async submitCreateSpace(): Promise<void> {
    await this.createSpaceBtn.click();
  }

  /**
   * Create workspace with all details
   */
  async createWorkspace(
    name: string,
    description: string,
    type: string,
  ): Promise<void> {
    await this.openCreateSpaceForm();
    await this.fillSpaceName(name);
    await this.fillDescription(description);
    await this.selectWorkspaceType(type);
    await this.submitCreateSpace();
  }

  /**
   * Go back to previous page
   */
  async goBack(): Promise<void> {
    await this.backBtn.click();
  }

  /* ==================== ASSERTIONS ==================== */

  /**
   * Verify workspace exists (appears in visible text)
   */
  async expectWorkspaceExists(name: string): Promise<void> {
    await expect(
      this.page.getByRole("link", { name: `Open ${name}` }),
    ).toBeVisible();
    // await expect(this.page.getByText(name).first()).toBeVisible();
    // await expect(this.page.getByRole("cell", { name: name })).toBeVisible();
  }

  /**
   * Verify workspace is in table
   */

  /**
   * Verify "Open workspace" link is visible
   */
  async expectOpenWorkspaceLink(name: string): Promise<void> {
    await expect(
      this.page.getByRole("link", { name: `Open ${name}` }),
    ).toBeVisible();
  }

  /**
   * Verify workspace is visible in complementary section (sidebar)
   */
  // async expectWorkspaceInSidebar(name: string): Promise<void> {
  //   await expect(this.page.getByRole("heading", { name: name })).toBeVisible();
  // }
}
