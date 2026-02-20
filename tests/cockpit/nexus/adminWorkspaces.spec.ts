import { test, expect } from "../../fixtures/roles.fixture";
import { PublicWorkspacePage } from "../../../pages/Cockpit/nexus/PublicWorkspace";
import { WorkspacePage } from "../../../pages/Cockpit/nexus/Workspace";
import { WorkspaceDataFactory } from "../../data/nexus/workspaceDataFactory";

test.describe("Workspace Management Tests", () => {
  let ownerWorkspace: PublicWorkspacePage;
  let adminWorkspace: WorkspacePage;
  let userWorkspace: PublicWorkspacePage;
  let workspaceData: ReturnType<
    typeof WorkspaceDataFactory.generateWorkspaceData
  >;

  test.beforeEach(async () => {
    workspaceData = WorkspaceDataFactory.generateWorkspaceData();
  });
  test("Workspace created by User appears in Admin table", async ({
    adminPage,
    userPage,
    ownerA,
  }) => {
    // User creates workspace in Public Workspace
    await adminPage.goto("/spaces");
    await ownerA.goto("/spaces");
    ownerWorkspace = new PublicWorkspacePage(ownerA);
    adminWorkspace = new WorkspacePage(adminPage);
    await ownerWorkspace.navigateToSpaces();
    await ownerWorkspace.openCreateSpaceForm();
    await ownerWorkspace.fillSpaceName(workspaceData.name);
    await ownerWorkspace.fillDescription(workspaceData.description);
    await ownerWorkspace.selectWorkspaceType(workspaceData.type);
    await ownerWorkspace.submitCreateSpace();

    // Verify workspace created and appears in user list
    await ownerWorkspace.expandSidebar();
    await ownerWorkspace.goBack();
    await ownerWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Admin able to see the workspace created by user in Admin Workspace table
    await adminWorkspace.navigateToWorkspaces();
    await adminWorkspace.expectWorkspaceInTable(workspaceData.name);
    await adminWorkspace.expectWorkspaceExists(workspaceData.name);

    // Delete
    await adminWorkspace.deleteWorkspace(workspaceData.name);
    await adminWorkspace.expectWorkspaceNotInTable(workspaceData.name);
  });

  test("Workspace renamed by Admin is updated for all members and searchable only by the new name", async ({
    adminPage,
    userPage,
    ownerA,
  }) => {
    // User creates workspace in Public Workspace
    await adminPage.goto("/spaces");
    await ownerA.goto("/spaces");
    ownerWorkspace = new PublicWorkspacePage(ownerA);
    adminWorkspace = new WorkspacePage(adminPage);
    await ownerWorkspace.navigateToSpaces();
    await ownerWorkspace.openCreateSpaceForm();
    await ownerWorkspace.fillSpaceName(workspaceData.name);
    await ownerWorkspace.fillDescription(workspaceData.description);
    await ownerWorkspace.selectWorkspaceType(workspaceData.type);
    await ownerWorkspace.submitCreateSpace();

    // Verify workspace created and appears in user list
    await ownerWorkspace.expandSidebar();
    await ownerWorkspace.goBack();
    await ownerWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Admin able to see the workspace created by user in Admin Workspace table
    await adminWorkspace.navigateToWorkspaces();
    await adminWorkspace.expectWorkspaceInTable(workspaceData.name);
    await adminWorkspace.expectWorkspaceExists(workspaceData.name);

    // Admin rename workspace
    const editedName = `${workspaceData.name}_edited`;
    await adminWorkspace.renameWorkspace(workspaceData.name, editedName);
    await expect(adminPage.getByText(editedName).first()).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(editedName);

    // User check in public workspace that the workspace name is updated
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.expectOpenWorkspaceLink2(editedName);

    // In search
    await ownerWorkspace.searchWorkspace(editedName);
    await ownerWorkspace.expectOpenWorkspaceLink2(editedName);

    // Delete
    await adminWorkspace.deleteWorkspace(editedName);
    await adminWorkspace.expectWorkspaceNotInTable(editedName);
  });

  test("Workspace archived by Admin is removed from user Spaces, appears in Archived tab", async ({
    adminPage,
    userPage,
    ownerA,
  }) => {
    // User creates workspace in Public Workspace
    await adminPage.goto("/spaces");
    await ownerA.goto("/spaces");
    ownerWorkspace = new PublicWorkspacePage(ownerA);
    adminWorkspace = new WorkspacePage(adminPage);
    await ownerWorkspace.navigateToSpaces();
    await ownerWorkspace.openCreateSpaceForm();
    await ownerWorkspace.fillSpaceName(workspaceData.name);
    await ownerWorkspace.fillDescription(workspaceData.description);
    await ownerWorkspace.selectWorkspaceType(workspaceData.type);
    await ownerWorkspace.submitCreateSpace();

    // Verify workspace created and appears in user list
    await ownerWorkspace.expandSidebar();
    await ownerWorkspace.goBack();
    await ownerWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Admin able to see the workspace created by user in Admin Workspace table
    await adminWorkspace.navigateToWorkspaces();
    await adminWorkspace.expectWorkspaceInTable(workspaceData.name);
    await adminWorkspace.expectWorkspaceExists(workspaceData.name);

    // Admin archive workspace
    await adminWorkspace.archiveWorkspace(workspaceData.name);
    await adminWorkspace.expectWorkspaceArchived(workspaceData.name);
    await expect(adminPage.getByText(workspaceData.name).first()).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(workspaceData.name);

    // User check in public workspace that the workspace is archived
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    // In search
    await ownerWorkspace.searchWorkspace(workspaceData.name);
    await ownerWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    // Verify it in Archive Tab
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.goToArchivedWorkspaces();
    await ownerWorkspace.expectWorkspaceInArchivedTab(workspaceData.name);
    await ownerWorkspace.searchArchivedWorkspace(workspaceData.name);
    await ownerWorkspace.expectWorkspaceInArchivedTab(workspaceData.name);

    // Delete
    await adminWorkspace.deleteWorkspace(workspaceData.name);
    await adminWorkspace.expectWorkspaceNotInTable(workspaceData.name);
  });

  test("Workspace unarchived by Admin returns to user Spaces and becomes accessible to members", async ({
    adminPage,
    userPage,
    ownerA,
  }) => {
    // User creates workspace in Public Workspace
    await adminPage.goto("/spaces");
    await ownerA.goto("/spaces");
    ownerWorkspace = new PublicWorkspacePage(ownerA);
    adminWorkspace = new WorkspacePage(adminPage);
    await ownerWorkspace.navigateToSpaces();
    await ownerWorkspace.openCreateSpaceForm();
    await ownerWorkspace.fillSpaceName(workspaceData.name);
    await ownerWorkspace.fillDescription(workspaceData.description);
    await ownerWorkspace.selectWorkspaceType(workspaceData.type);
    await ownerWorkspace.submitCreateSpace();

    // Verify workspace created and appears in user list
    await ownerWorkspace.expandSidebar();
    await ownerWorkspace.goBack();
    await ownerWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Admin able to see the workspace created by user in Admin Workspace table
    await adminWorkspace.navigateToWorkspaces();
    await adminWorkspace.expectWorkspaceInTable(workspaceData.name);
    await adminWorkspace.expectWorkspaceExists(workspaceData.name);

    // Admin archive workspace
    await adminWorkspace.archiveWorkspace(workspaceData.name);
    await adminWorkspace.expectWorkspaceArchived(workspaceData.name);
    await expect(adminPage.getByText(workspaceData.name).first()).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(workspaceData.name);

    // User check in public workspace that the workspace is archived
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    // In search
    await ownerWorkspace.searchWorkspace(workspaceData.name);
    await ownerWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    // Verify it in Archive Tab
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.goToArchivedWorkspaces();
    await ownerWorkspace.expectWorkspaceInArchivedTab(workspaceData.name);
    await ownerWorkspace.searchArchivedWorkspace(workspaceData.name);
    await ownerWorkspace.expectWorkspaceInArchivedTab(workspaceData.name);

    // Admin Unarchive workspace
    await adminWorkspace.UnArchiveWorkspace(workspaceData.name);
    await adminWorkspace.expectUnArchiveWorkspace(workspaceData.name);
    await expect(adminPage.getByText(workspaceData.name).first()).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(workspaceData.name);

    //User check in Archive Tab that the workspace is Unarchived {not in archive tab}
    await ownerWorkspace.reloadPage();
    // await ownerWorkspace.goToArchivedWorkspaces();
    await ownerWorkspace.expectWorkspaceNotInArchivedTab(workspaceData.name);
    await ownerWorkspace.searchArchivedWorkspace(workspaceData.name);
    await ownerWorkspace.expectWorkspaceNotInArchivedTab(workspaceData.name);

    // User check in public workspace that the workspace is Unarchived
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.goToSpaces();
    await ownerWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // In search
    await ownerWorkspace.searchWorkspace(workspaceData.name);
    await ownerWorkspace.expectOpenWorkspaceLink2(workspaceData.name);
    // await ownerWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    // // Delete
    await adminWorkspace.deleteWorkspace(workspaceData.name);
    await adminWorkspace.expectWorkspaceNotInTable(workspaceData.name);
  });

  test("Workspace deleted by Admin is permanently removed from all user views and Admin table", async ({
    adminPage,
    userPage,
    ownerA,
  }) => {
    // User creates workspace in Public Workspace
    await adminPage.goto("/spaces");
    await ownerA.goto("/spaces");
    ownerWorkspace = new PublicWorkspacePage(ownerA);
    adminWorkspace = new WorkspacePage(adminPage);
    await ownerWorkspace.navigateToSpaces();
    await ownerWorkspace.openCreateSpaceForm();
    await ownerWorkspace.fillSpaceName(workspaceData.name);
    await ownerWorkspace.fillDescription(workspaceData.description);
    await ownerWorkspace.selectWorkspaceType(workspaceData.type);
    await ownerWorkspace.submitCreateSpace();

    // Verify workspace created and appears in user list
    await ownerWorkspace.expandSidebar();
    await ownerWorkspace.goBack();
    await ownerWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Admin able to see the workspace created by user in Admin Workspace table
    await adminWorkspace.navigateToWorkspaces();
    await adminWorkspace.expectWorkspaceInTable(workspaceData.name);
    await adminWorkspace.expectWorkspaceExists(workspaceData.name);
    // Delete
    await adminWorkspace.deleteWorkspace(workspaceData.name);
    await adminWorkspace.expectWorkspaceNotInTable(workspaceData.name);

    // User check in public workspace that the workspace is Not Present
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    // In search
    await ownerWorkspace.searchWorkspace(workspaceData.name);
    await ownerWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    //User check in Archive Tab that the workspace is Not Present
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.goToArchivedWorkspaces();
    await ownerWorkspace.expectWorkspaceNotInArchivedTab(workspaceData.name);
    //In Search
    await ownerWorkspace.searchArchivedWorkspace(workspaceData.name);
    await ownerWorkspace.expectWorkspaceNotInArchivedTab(workspaceData.name);

    //Admin verify in workspace table that the workspace is Not Present
    await adminWorkspace.expectWorkspaceNotInTable(workspaceData.name);
  });

  test("Workspace renamed by User is reflected in Admin table and visible to all members ", async ({
    adminPage,
    userPage,
    ownerA,
  }) => {
    // User creates workspace in Public Workspace
    await adminPage.goto("/spaces");
    await ownerA.goto("/spaces");
    ownerWorkspace = new PublicWorkspacePage(ownerA);
    adminWorkspace = new WorkspacePage(adminPage);

    await ownerWorkspace.navigateToSpaces();
    await ownerWorkspace.openCreateSpaceForm();
    await ownerWorkspace.fillSpaceName(workspaceData.name);
    await ownerWorkspace.fillDescription(workspaceData.description);
    await ownerWorkspace.selectWorkspaceType(workspaceData.type);
    await ownerWorkspace.submitCreateSpace();

    // Verify workspace created and appears in user list
    await ownerWorkspace.expandSidebar();
    await ownerWorkspace.goBack();
    await ownerWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Admin able to see the workspace created by user in Admin Workspace table
    await adminWorkspace.navigateToWorkspaces();
    await adminWorkspace.expectWorkspaceInTable(workspaceData.name);
    await adminWorkspace.expectWorkspaceExists(workspaceData.name);

    // User rename workspace (performed via PublicWorkspacePage helper)
    const editedName = `${workspaceData.name}_edited`;
    await ownerWorkspace.renameWorkspaceByUser(workspaceData.name, editedName);
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.expectOpenWorkspaceLink2(editedName);

    // Admin able to see the workspace renamed by user in Admin Workspace table
    await adminWorkspace.reloadPage();
    await adminWorkspace.expectWorkspaceInTable(editedName);
    await adminWorkspace.expectWorkspaceExists(editedName);

    // Delete
    await adminWorkspace.deleteWorkspace(editedName);
    await adminWorkspace.expectWorkspaceNotInTable(editedName);
  });

  test("Workspace shared by Admin is visible only to the specified user ", async ({
    adminPage,
    userPage,
    ownerA,
  }) => {
    await userPage.goto("/spaces");

    await adminPage.goto("/spaces");
    await ownerA.goto("/spaces");
    ownerWorkspace = new PublicWorkspacePage(ownerA);
    adminWorkspace = new WorkspacePage(adminPage);
    userWorkspace = new PublicWorkspacePage(userPage);
    const member = "Edward Member";
    // User creates workspace in Public Workspace
    await ownerWorkspace.navigateToSpaces();
    await ownerWorkspace.openCreateSpaceForm();
    await ownerWorkspace.fillSpaceName(workspaceData.name);
    await ownerWorkspace.fillDescription(workspaceData.description);
    await ownerWorkspace.selectWorkspaceType(workspaceData.type);
    await ownerWorkspace.submitCreateSpace();

    // Verify workspace created and appears in user list
    await ownerWorkspace.expandSidebar();
    await ownerWorkspace.goBack();
    await ownerWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Admin able to see the workspace created by user in Admin Workspace table
    await adminWorkspace.navigateToWorkspaces();
    await adminWorkspace.expectWorkspaceInTable(workspaceData.name);
    await adminWorkspace.expectWorkspaceExists(workspaceData.name);

    //Admin add member
    await adminWorkspace.shareWorkspace(workspaceData.name, member);

    //user verify the workspace is shared in their workspace list
    await userWorkspace.expandSidebar();
    await userWorkspace.navigateToSpaces();
    await userWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Delete
    await adminWorkspace.deleteWorkspace(workspaceData.name);
    await adminWorkspace.expectWorkspaceNotInTable(workspaceData.name);
  });

  test("Admin rename after sharing updates workspace name for all members", async ({
    adminPage,
    userPage,
    ownerA,
  }) => {
    await userPage.goto("/spaces");

    await adminPage.goto("/spaces");
    await ownerA.goto("/spaces");
    ownerWorkspace = new PublicWorkspacePage(ownerA);
    adminWorkspace = new WorkspacePage(adminPage);
    userWorkspace = new PublicWorkspacePage(userPage);
    const member = "Edward Member";
    // User creates workspace in Public Workspace
    await ownerWorkspace.navigateToSpaces();
    await ownerWorkspace.openCreateSpaceForm();
    await ownerWorkspace.fillSpaceName(workspaceData.name);
    await ownerWorkspace.fillDescription(workspaceData.description);
    await ownerWorkspace.selectWorkspaceType(workspaceData.type);
    await ownerWorkspace.submitCreateSpace();

    // Verify workspace created and appears in user list
    await ownerWorkspace.expandSidebar();
    await ownerWorkspace.goBack();
    await ownerWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Admin able to see the workspace created by user in Admin Workspace table
    await adminWorkspace.navigateToWorkspaces();
    await adminWorkspace.expectWorkspaceInTable(workspaceData.name);
    await adminWorkspace.expectWorkspaceExists(workspaceData.name);

    //Admin add member
    await adminWorkspace.shareWorkspace(workspaceData.name, member);

    //user verify the workspace is shared in their workspace list
    await userWorkspace.expandSidebar();
    await userWorkspace.navigateToSpaces();
    await userWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Admin rename workspace
    const editedName = `${workspaceData.name}_edited`;
    await adminWorkspace.renameWorkspace(workspaceData.name, editedName);
    await expect(adminPage.getByText(editedName).first()).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(editedName);

    // Owner check in public workspace that the workspace name is updated
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.expectOpenWorkspaceLink2(editedName);

    // In search
    await ownerWorkspace.searchWorkspace(editedName);
    await ownerWorkspace.expectOpenWorkspaceLink2(editedName);

    //Added member  check in public workspace that the workspace name is updated
    await userWorkspace.reloadPage();
    await userWorkspace.expectOpenWorkspaceLink2(editedName);

    // In search
    await userWorkspace.searchWorkspace(editedName);
    await userWorkspace.expectOpenWorkspaceLink2(editedName);

    // Delete
    await adminWorkspace.deleteWorkspace(editedName);
    await adminWorkspace.expectWorkspaceNotInTable(editedName);
  });

  test("Workspace archived by Admin after sharing moves to Archived tab for all members", async ({
    adminPage,
    userPage,
    ownerA,
  }) => {
    await userPage.goto("/spaces");

    await adminPage.goto("/spaces");
    await ownerA.goto("/spaces");
    ownerWorkspace = new PublicWorkspacePage(ownerA);
    adminWorkspace = new WorkspacePage(adminPage);
    userWorkspace = new PublicWorkspacePage(userPage);
    const member = "Edward Member";
    // User creates workspace in Public Workspace
    await ownerWorkspace.navigateToSpaces();
    await ownerWorkspace.openCreateSpaceForm();
    await ownerWorkspace.fillSpaceName(workspaceData.name);
    await ownerWorkspace.fillDescription(workspaceData.description);
    await ownerWorkspace.selectWorkspaceType(workspaceData.type);
    await ownerWorkspace.submitCreateSpace();

    // Verify workspace created and appears in user list
    await ownerWorkspace.expandSidebar();
    await ownerWorkspace.goBack();
    await ownerWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Admin able to see the workspace created by user in Admin Workspace table
    await adminWorkspace.navigateToWorkspaces();
    await adminWorkspace.expectWorkspaceInTable(workspaceData.name);
    await adminWorkspace.expectWorkspaceExists(workspaceData.name);

    //Admin add member
    await adminWorkspace.shareWorkspace(workspaceData.name, member);

    //Add member verify the workspace is shared in their workspace list
    await userWorkspace.expandSidebar();
    await userWorkspace.navigateToSpaces();
    await userWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Admin archive workspace
    await adminWorkspace.archiveWorkspace(workspaceData.name);
    await adminWorkspace.expectWorkspaceArchived(workspaceData.name);
    await expect(adminPage.getByText(workspaceData.name).first()).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(workspaceData.name);

    // Owner user (Creator of workspace) check in public workspace that the workspace is archived
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    // In search
    await ownerWorkspace.searchWorkspace(workspaceData.name);
    await ownerWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    // Verify it in Archive Tab
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.goToArchivedWorkspaces();
    await ownerWorkspace.expectWorkspaceInArchivedTab(workspaceData.name);
    await ownerWorkspace.searchArchivedWorkspace(workspaceData.name);
    await ownerWorkspace.expectWorkspaceInArchivedTab(workspaceData.name);

    // Owner user Add by admin check in public workspace that the workspace is archived
    await userWorkspace.reloadPage();
    await userWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    // In search
    await userWorkspace.searchWorkspace(workspaceData.name);
    await userWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    // Verify it in Archive Tab
    await userWorkspace.reloadPage();
    await userWorkspace.goToArchivedWorkspaces();
    await userWorkspace.expectWorkspaceInArchivedTab(workspaceData.name);
    await userWorkspace.searchArchivedWorkspace(workspaceData.name);
    await userWorkspace.expectWorkspaceInArchivedTab(workspaceData.name);
    //////////////////////////////////////////////////////

    // Delete
    await adminWorkspace.deleteWorkspace(workspaceData.name);
    await adminWorkspace.expectWorkspaceNotInTable(workspaceData.name);
  });

  test("Workspace deleted by Admin after sharing immediately removes access for all users", async ({
    adminPage,
    userPage,
    ownerA,
  }) => {
    await userPage.goto("/spaces");

    await adminPage.goto("/spaces");
    await ownerA.goto("/spaces");
    ownerWorkspace = new PublicWorkspacePage(ownerA);
    adminWorkspace = new WorkspacePage(adminPage);
    userWorkspace = new PublicWorkspacePage(userPage);
    const member = "Edward Member";
    // User creates workspace in Public Workspace
    await ownerWorkspace.navigateToSpaces();
    await ownerWorkspace.openCreateSpaceForm();
    await ownerWorkspace.fillSpaceName(workspaceData.name);
    await ownerWorkspace.fillDescription(workspaceData.description);
    await ownerWorkspace.selectWorkspaceType(workspaceData.type);
    await ownerWorkspace.submitCreateSpace();

    // Verify workspace created and appears in user list
    await ownerWorkspace.expandSidebar();
    await ownerWorkspace.goBack();
    await ownerWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Admin able to see the workspace created by user in Admin Workspace table
    await adminWorkspace.navigateToWorkspaces();
    await adminWorkspace.expectWorkspaceInTable(workspaceData.name);
    await adminWorkspace.expectWorkspaceExists(workspaceData.name);

    //Admin add member
    await adminWorkspace.shareWorkspace(workspaceData.name, member);

    //Add member verify the workspace is shared in their workspace list
    await userWorkspace.expandSidebar();
    await userWorkspace.navigateToSpaces();
    await userWorkspace.expectOpenWorkspaceLink2(workspaceData.name);

    // Delete
    await adminWorkspace.deleteWorkspace(workspaceData.name);
    await adminWorkspace.expectWorkspaceNotInTable(workspaceData.name);

    // Owner user check in public workspace that the workspace is Deleted (not present)
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    // In search
    await ownerWorkspace.searchWorkspace(workspaceData.name);
    await ownerWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    //User check in Archive Tab that the workspace is Deleted {not in archive tab}
    await ownerWorkspace.reloadPage();
    await ownerWorkspace.goToArchivedWorkspaces();
    await ownerWorkspace.expectWorkspaceNotInArchivedTab(workspaceData.name);
    await ownerWorkspace.searchArchivedWorkspace(workspaceData.name);
    await ownerWorkspace.expectWorkspaceNotInArchivedTab(workspaceData.name);

    // Owner user check in public workspace that the workspace is archived
    await userWorkspace.reloadPage();
    await userWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    // In search
    await userWorkspace.searchWorkspace(workspaceData.name);
    await userWorkspace.expectWorkspaceLinkNotPresent(workspaceData.name);

    //User Add by admin check in Archive Tab that the workspace is Deleted {not in archive tab}
    await userWorkspace.reloadPage();
    await userWorkspace.goToArchivedWorkspaces();
    await userWorkspace.expectWorkspaceNotInArchivedTab(workspaceData.name);
    await userWorkspace.searchArchivedWorkspace(workspaceData.name);
    await userWorkspace.expectWorkspaceNotInArchivedTab(workspaceData.name);
  });
});
