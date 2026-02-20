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

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  async reloadPage(): Promise<void> {
    await this.page.reload({ waitUntil: "networkidle" });
  }
  async expectOpenWorkspaceLink2(name: string): Promise<void> {
    await expect(
      this.page.getByRole("link", {
        name: new RegExp(`^Open ${this.escapeRegex(name)}`),
      }),
    ).toBeVisible();
  }
  async expectWorkspaceLinkNotPresent(name: string): Promise<void> {
    await expect(
      this.page.getByRole("link", {
        name: new RegExp(`^Open ${this.escapeRegex(name)}`),
      }),
    ).toHaveCount(0);
  }

  /**
   * Expand sidebar
   */
  async expandSidebar(): Promise<void> {
    await this.page.getByRole("button", { name: "Expand sidebar" }).click();
  }

  /**
   * Navigate to archived workspaces section
   */
  async goToArchivedWorkspaces(): Promise<void> {
    await this.expandSidebar();
    await this.page
      .getByRole("button", { name: "Archived Workspaces" })
      .click();
  }
  async goToSpaces(): Promise<void> {
    await this.expandSidebar();
    await this.page
      .getByRole("button", { name: "Spaces", exact: true })
      .click();
  }

  /**
   * Search for workspace in archived workspaces section
   */
  async searchArchivedWorkspace(name: string): Promise<void> {
    await this.page
      .getByRole("textbox", { name: "Search archived workspaces..." })
      .click();
    await this.page
      .getByRole("textbox", { name: "Search archived workspaces..." })
      .fill(name);
    await this.page
      .getByRole("textbox", { name: "Search archived workspaces..." })
      .press("Enter");
  }

  /**
   * Search in active workspaces search box
   */
  async searchWorkspace(name: string): Promise<void> {
    await this.page
      .getByRole("textbox", { name: "Search your spaces..." })
      .click();
    await this.page
      .getByRole("textbox", { name: "Search your spaces..." })
      .fill(name);
  }

  /**
   * Verify workspace appears in archived workspaces section
   */
  async expectWorkspaceInArchivedTab(name: string): Promise<void> {
    await expect(this.page.getByRole("heading", { name: name })).toBeVisible();
  }

  async expectWorkspaceNotInArchivedTab(name: string): Promise<void> {
    await expect(this.page.getByRole("heading", { name })).toHaveCount(0);
  }

  /**
   * Open workspace options for a workspace card by name
   * Tries to click the nth svg (default 2) inside the card, falls back to the options button
   */
  async openWorkspaceOptionsByName(name: string, svgIndex = 2): Promise<void> {
    const card = this.page.locator(
      `xpath=//h3[contains(normalize-space(.), "${name}")]/ancestor::div[contains(@class, 'group')][1]`,
    );
    await expect(card).toHaveCount(1);
    const svgs = card.locator("svg");
    const svgCount = await svgs.count();
    if (svgCount > svgIndex) {
      try {
        await svgs.nth(svgIndex).click();
        return;
      } catch (err) {
        // fallback to options button
      }
    }
    await card.getByRole("button", { name: "Workspace options" }).click();
  }

  /**
   * Rename a workspace as a regular user via the workspace card
   */
  async renameWorkspaceByUser(oldName: string, newName: string): Promise<void> {
    await this.openWorkspaceOptionsByName(oldName, 2);
    await this.page.getByRole("button", { name: "Rename" }).click();
    const textbox = this.page.getByRole("textbox", {
      name: "Enter New Workspace Name",
    });
    await textbox.click();
    await textbox.fill(newName);
    await this.page.getByRole("button", { name: "Rename" }).click();
  }
}
