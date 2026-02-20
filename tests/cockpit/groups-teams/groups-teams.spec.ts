import { test, expect } from "../../fixtures/roles.fixture";
import { GroupsTeamsPage } from "../../../pages/Cockpit/groups-teams/groups-teams.page";
import { groupsTeamsTestData } from "../../data/groups-teams.testdata";

test.describe("Groups & Teams Module", () => {
  test.beforeEach(async ({ adminPage }) => {
    const groupsTeams = new GroupsTeamsPage(adminPage);
    await groupsTeams.navigate();
  });

  // ===============================
  // TC01 - Expand and Collapse Group
  // ===============================
  test("TC01 - Expand and Collapse Group", async ({ adminPage }) => {
    const groupsTeams = new GroupsTeamsPage(adminPage);

    const groupRow = groupsTeams.groupRow(groupsTeamsTestData.groups.default);

    const expandButton = groupRow.getByRole("button").first();

    await expandButton.click();
    await expect(groupRow).toBeVisible();

    await expandButton.click();
  });

  // ===============================
  // TC02 - Create Group
  // ===============================
  test("TC02 - Create Group", async ({ adminPage }) => {
    const groupsTeams = new GroupsTeamsPage(adminPage);

    await adminPage.getByRole("button", { name: "Create Group" }).click();

    await adminPage
      .getByRole("textbox", { name: "Name *" })
      .fill(groupsTeamsTestData.groups.newGroup);

    await adminPage
      .getByRole("textbox", { name: "Search owner" })
      .fill(groupsTeamsTestData.owners.owner1);

    await adminPage.getByRole("button", { name: "Create" }).click();

    await expect(
      adminPage
        .locator("tr")
        .filter({ hasText: groupsTeamsTestData.groups.newGroup }),
    ).toBeVisible();
  });

  // ===============================
  // TC03 - Create Team Under Group
  // ===============================
  test("TC03 - Create Team", async ({ adminPage }) => {
    await adminPage.getByRole("link", { name: "Teams", exact: true }).click();

    await adminPage.getByRole("button", { name: "Create Team" }).click();

    await adminPage.getByRole("combobox").first().click();
    await adminPage
      .getByRole("option", {
        name: groupsTeamsTestData.groups.newGroup,
      })
      .click();

    await adminPage
      .getByRole("textbox", { name: "Name *" })
      .fill(groupsTeamsTestData.teams.newTeam);

    await adminPage
      .getByRole("textbox", { name: "Search owner" })
      .fill(groupsTeamsTestData.owners.owner1);

    await adminPage.getByRole("button", { name: "Create" }).click();

    await expect(
      adminPage
        .locator("tr")
        .filter({ hasText: groupsTeamsTestData.teams.newTeam }),
    ).toBeVisible();
  });

  // ===============================
  // TC04 - Add & Remove Team Members
  // ===============================
  test("TC04 - Add and Remove Team Members", async ({ adminPage }) => {
    await adminPage.getByRole("link", { name: "Teams", exact: true }).click();

    await adminPage.getByRole("combobox").click();
    await adminPage
      .getByRole("option", {
        name: groupsTeamsTestData.groups.newGroup,
      })
      .click();

    const teamRow = adminPage
      .locator("tr")
      .filter({ hasText: groupsTeamsTestData.teams.newTeam })
      .first();

    // Open action menu
    await teamRow.locator('[aria-haspopup="menu"]').click();

    const actionMenu = adminPage.locator('[role="menu"]').last();

    await actionMenu.getByRole("menuitem", { name: "Manage Members" }).click();

    // Add Member 1
    await adminPage.getByRole("combobox").click();
    await adminPage
      .getByRole("listbox")
      .getByRole("option", {
        name: groupsTeamsTestData.owners.owner1,
        exact: true,
      })
      .click();
    await adminPage.getByRole("button", { name: "Add" }).click();

    // Add Member 2
    await adminPage.getByRole("combobox").click();
    await adminPage
      .getByRole("listbox")
      .getByRole("option", {
        name: groupsTeamsTestData.owners.owner2,
        exact: true,
      })
      .click();
    await adminPage.getByRole("button", { name: "Add" }).click();

    await adminPage.getByRole("button", { name: "Close" }).click();

    // Re-open Manage Members
    await teamRow.locator('[aria-haspopup="menu"]').click();

    await adminPage
      .locator('[role="menu"]')
      .last()
      .getByRole("menuitem", { name: "Manage Members" })
      .click();

    // Remove Member 1
    await adminPage
      .getByRole("row", {
        name: groupsTeamsTestData.owners.owner1,
      })
      .getByRole("cell")
      .nth(2)
      .click();

    // Remove Member 2
    await adminPage
      .getByRole("row", {
        name: groupsTeamsTestData.owners.owner2,
      })
      .getByRole("cell")
      .nth(2)
      .click();

    await adminPage.getByRole("button", { name: "Close" }).click();
  });

  // ===============================
  // TC05 - Edit Team Name
  // ===============================
  test("TC05 - Edit Team Name", async ({ adminPage }) => {
    await adminPage.getByRole("link", { name: "Teams", exact: true }).click();

    await adminPage.getByRole("combobox").click();
    await adminPage
      .getByRole("option", {
        name: groupsTeamsTestData.groups.newGroup,
      })
      .click();

    const teamRow = adminPage
      .locator("tr")
      .filter({ hasText: groupsTeamsTestData.teams.newTeam })
      .first();

    await teamRow.locator('[aria-haspopup="menu"]').click();

    await adminPage
      .getByRole("menuitem", { name: "Edit", exact: true })
      .last()
      .click({ force: true });

    await adminPage
      .getByRole("textbox", { name: "Name *" })
      .fill(groupsTeamsTestData.teams.updatedTeam);

    await adminPage.getByRole("button", { name: "Update" }).click();

    await expect(
      adminPage
        .locator("tr")
        .filter({ hasText: groupsTeamsTestData.teams.updatedTeam }),
    ).toBeVisible();
  });

  // ===============================
  // TC06 - Delete Team
  // ===============================
  test("TC06 - Delete Team", async ({ adminPage }) => {
    await adminPage.getByRole("link", { name: "Teams", exact: true }).click();

    await adminPage.getByRole("combobox").click();
    await adminPage
      .getByRole("option", {
        name: groupsTeamsTestData.groups.newGroup,
      })
      .click();

    const teamRow = adminPage
      .locator("tr")
      .filter({ hasText: groupsTeamsTestData.teams.newTeam })
      .first();

    await teamRow.locator('[aria-haspopup="menu"]').click();

    await adminPage.getByRole("menuitem", { name: "Delete" }).click();
    await adminPage.getByRole("button", { name: "Delete" }).click();

    await expect(
      adminPage
        .locator("tr")
        .filter({ hasText: groupsTeamsTestData.teams.updatedTeam }),
    ).toHaveCount(0);
  });

  // ===============================
  // TC07 - Edit & Delete Group
  // ===============================
  test("TC07 - Edit and Delete Group", async ({ adminPage }) => {
    await adminPage.getByRole("link", { name: "Groups", exact: true }).click();

    const groupRow = adminPage
      .locator("tr")
      .filter({ hasText: groupsTeamsTestData.groups.newGroup })
      .first();

    await groupRow.getByRole("button").click();
    await adminPage.getByRole("menuitem", { name: "Edit" }).click();

    await adminPage
      .getByRole("textbox", { name: "Name *" })
      .fill(groupsTeamsTestData.groups.updatedGroup);

    await adminPage.getByRole("button", { name: "Update" }).click();

    const updatedRow = adminPage
      .locator("tr")
      .filter({ hasText: groupsTeamsTestData.groups.updatedGroup })
      .first();

    await updatedRow.getByRole("button").click();
    await adminPage.getByRole("menuitem", { name: "Delete" }).click();
    await adminPage.getByRole("button", { name: "Delete" }).click();

    await expect(updatedRow).toHaveCount(0);
  });

  // ===============================
  // TC08 - Toggle List and Tree View
  // ===============================
  test("TC08 - Toggle List and Tree View", async ({ adminPage }) => {
    await adminPage
      .getByRole("button", {
        name: groupsTeamsTestData.views.list,
      })
      .click();

    await adminPage
      .getByRole("button", {
        name: groupsTeamsTestData.views.tree,
      })
      .click();

    await expect(
      adminPage.getByRole("button", {
        name: groupsTeamsTestData.views.tree,
      }),
    ).toBeVisible();
  });
});
