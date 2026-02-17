import { test, expect } from '@playwright/test';
import { GroupsTeamsPage } from '../../../pages/groups-teams/groups-teams.page';
import { groupsTeamsTestData } from '../../testdata/groups-teams.testdata';

test.describe('Groups & Teams Module', () => {

  test.beforeEach(async ({ page }) => {
    const groupsTeams = new GroupsTeamsPage(page);
    await groupsTeams.navigate();
  });

  // ===============================
  // TC01 - Expand and Collapse Group
  // ===============================
  test('TC01 - Expand and Collapse Group', async ({ page }) => {

    const groupsTeams = new GroupsTeamsPage(page);

    const groupRow = groupsTeams.groupRow(
      groupsTeamsTestData.groups.default
    );

    const expandButton = groupRow.getByRole('button').first();

    await expandButton.click();
    await expect(groupRow).toBeVisible();

    await expandButton.click();
  });


  // ===============================
  // TC02 - Create Group
  // ===============================
  test('TC02 - Create Group', async ({ page }) => {

    const groupsTeams = new GroupsTeamsPage(page);

    await page.getByRole('button', { name: 'Create Group' }).click();

    await page.getByRole('textbox', { name: 'Name *' })
      .fill(groupsTeamsTestData.groups.newGroup);

    await page.getByRole('textbox', { name: 'Search owner' })
      .fill(groupsTeamsTestData.owners.owner1);

    await page.getByRole('button', { name: 'Create' }).click();

    await expect(
      page.locator('tr')
        .filter({ hasText: groupsTeamsTestData.groups.newGroup })
    ).toBeVisible();
  });


  // ===============================
  // TC03 - Create Team Under Group
  // ===============================
  test('TC03 - Create Team', async ({ page }) => {

    await page.getByRole('link', { name: 'Teams', exact: true }).click();

    await page.getByRole('button', { name: 'Create Team' }).click();

    await page.getByRole('combobox').first().click();
    await page.getByRole('option', {
      name: groupsTeamsTestData.groups.newGroup
    }).click();

    await page.getByRole('textbox', { name: 'Name *' })
      .fill(groupsTeamsTestData.teams.newTeam);

    await page.getByRole('textbox', { name: 'Search owner' })
      .fill(groupsTeamsTestData.owners.owner1);

    await page.getByRole('button', { name: 'Create' }).click();

    await expect(
      page.locator('tr')
        .filter({ hasText: groupsTeamsTestData.teams.newTeam })
    ).toBeVisible();
  });


  // ===============================
  // TC04 - Add & Remove Team Members
  // ===============================
  test('TC04 - Add and Remove Team Members', async ({ page }) => {

    await page.getByRole('link', { name: 'Teams', exact: true }).click();

    await page.getByRole('combobox').click();
    await page.getByRole('option', {
      name: groupsTeamsTestData.groups.newGroup
    }).click();

    const teamRow = page.locator('tr')
      .filter({ hasText: groupsTeamsTestData.teams.newTeam })
      .first();

    // Open action menu
    await teamRow.locator('[aria-haspopup="menu"]').click();

    const actionMenu = page.locator('[role="menu"]').last();

    await actionMenu
      .getByRole('menuitem', { name: 'Manage Members' })
      .click();

    // Add Member 1
    await page.getByRole('combobox').click();
    await page.getByRole('listbox')
      .getByRole('option', {
        name: groupsTeamsTestData.owners.owner1,
        exact: true
      }).click();
    await page.getByRole('button', { name: 'Add' }).click();

    // Add Member 2
    await page.getByRole('combobox').click();
    await page.getByRole('listbox')
      .getByRole('option', {
        name: groupsTeamsTestData.owners.owner2,
        exact: true
      }).click();
    await page.getByRole('button', { name: 'Add' }).click();

    await page.getByRole('button', { name: 'Close' }).click();

    // Re-open Manage Members
    await teamRow.locator('[aria-haspopup="menu"]').click();

    await page.locator('[role="menu"]').last()
      .getByRole('menuitem', { name: 'Manage Members' })
      .click();

    // Remove Member 1
    await page.getByRole('row', {
      name: groupsTeamsTestData.owners.owner1
    }).getByRole('cell').nth(2).click();

    // Remove Member 2
    await page.getByRole('row', {
      name: groupsTeamsTestData.owners.owner2
    }).getByRole('cell').nth(2).click();

    await page.getByRole('button', { name: 'Close' }).click();
  });


  // ===============================
  // TC05 - Edit Team Name
  // ===============================
  test('TC05 - Edit Team Name', async ({ page }) => {

    await page.getByRole('link', { name: 'Teams', exact: true }).click();

    await page.getByRole('combobox').click();
    await page.getByRole('option', {
      name: groupsTeamsTestData.groups.newGroup
    }).click();

    const teamRow = page.locator('tr')
      .filter({ hasText: groupsTeamsTestData.teams.newTeam })
      .first();

    await teamRow.locator('[aria-haspopup="menu"]').click();

    await page
      .getByRole('menuitem', { name: 'Edit', exact: true })
      .last()
      .click({ force: true });

    await page.getByRole('textbox', { name: 'Name *' })
      .fill(groupsTeamsTestData.teams.updatedTeam);

    await page.getByRole('button', { name: 'Update' }).click();

    await expect(
      page.locator('tr')
        .filter({ hasText: groupsTeamsTestData.teams.updatedTeam })
    ).toBeVisible();
  });


  // ===============================
  // TC06 - Delete Team
  // ===============================
  test('TC06 - Delete Team', async ({ page }) => {

    await page.getByRole('link', { name: 'Teams', exact: true }).click();

    await page.getByRole('combobox').click();
    await page.getByRole('option', {
      name: groupsTeamsTestData.groups.newGroup
    }).click();

    const teamRow = page.locator('tr')
      .filter({ hasText: groupsTeamsTestData.teams.newTeam })
      .first();

    await teamRow.locator('[aria-haspopup="menu"]').click();

    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(
      page.locator('tr')
        .filter({ hasText: groupsTeamsTestData.teams.updatedTeam })
    ).toHaveCount(0);
  });


  // ===============================
  // TC07 - Edit & Delete Group
  // ===============================
  test('TC07 - Edit and Delete Group', async ({ page }) => {

    await page.getByRole('link', { name: 'Groups', exact: true }).click();

    const groupRow = page.locator('tr')
      .filter({ hasText: groupsTeamsTestData.groups.newGroup })
      .first();

    await groupRow.getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();

    await page.getByRole('textbox', { name: 'Name *' })
      .fill(groupsTeamsTestData.groups.updatedGroup);

    await page.getByRole('button', { name: 'Update' }).click();

    const updatedRow = page.locator('tr')
      .filter({ hasText: groupsTeamsTestData.groups.updatedGroup })
      .first();

    await updatedRow.getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(updatedRow).toHaveCount(0);
  });


  // ===============================
  // TC08 - Toggle List and Tree View
  // ===============================
  test('TC08 - Toggle List and Tree View', async ({ page }) => {

    await page.getByRole('button', {
      name: groupsTeamsTestData.views.list
    }).click();

    await page.getByRole('button', {
      name: groupsTeamsTestData.views.tree
    }).click();

    await expect(
      page.getByRole('button', {
        name: groupsTeamsTestData.views.tree
      })
    ).toBeVisible();
  });

});
