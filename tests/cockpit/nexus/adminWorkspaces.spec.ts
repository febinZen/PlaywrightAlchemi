import { expect } from "@playwright/test";
import { test } from "../../fixtures/roles.fixture";
import { PublicWorkspacePage } from "../../../pages/nexus/PublicWorkspace";
import { WorkspacePage } from "../../../pages/nexus/Workspace";
import { WorkspaceDataFactory } from "../../data/nexus/workspaceDataFactory";

test.describe("Workspace Management Tests", () => {
  let publicWorkspace: PublicWorkspacePage;
  let adminWorkspace: WorkspacePage;
  let workspaceData: ReturnType<
    typeof WorkspaceDataFactory.generateWorkspaceData
  >;

  test.beforeEach(async ({ adminPage, userPage }) => {
    await adminPage.goto("/spaces");
    await userPage.goto("/spaces");
    publicWorkspace = new PublicWorkspacePage(userPage);
    adminWorkspace = new WorkspacePage(adminPage);
    workspaceData = WorkspaceDataFactory.generateWorkspaceData();
  });
  test("Workspace created by User appears in Admin table", async ({
    adminPage,
    userPage,
  }) => {
    //User creates workspace in Public Workspace
    await publicWorkspace.navigateToSpaces();
    await publicWorkspace.openCreateSpaceForm();
    await publicWorkspace.fillSpaceName(workspaceData.name);
    await publicWorkspace.fillDescription(workspaceData.description);
    await publicWorkspace.selectWorkspaceType(workspaceData.type);
    await publicWorkspace.submitCreateSpace();

    //Verify workspace created and appears in user list
    await userPage.getByRole("button", { name: "Expand sidebar" }).click();
    // await publicWorkspace.expectWorkspaceInSidebar(workspaceData.name);
    await publicWorkspace.goBack();
    await publicWorkspace.expectOpenWorkspaceLink(workspaceData.name);

    //Admin able to see the workspace created by user in Admin Workspace table
    await adminWorkspace.navigateToWorkspaces();
    await adminWorkspace.expectWorkspaceInTable(workspaceData.name);
    await adminWorkspace.expectWorkspaceExists(workspaceData.name);

    //delete
    await adminWorkspace.deleteWorkspace(workspaceData.name);
    await adminWorkspace.expectWorkspaceNotInTable(workspaceData.name);
  });
});
