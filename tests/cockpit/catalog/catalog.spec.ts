import { test, expect } from "../../fixtures/roles.fixture";
import { CatalogPage } from "../../../pages/Cockpit/catalog/catalog.page";
import { catalogTestData } from "../../data/catalog.testdata";
import { CockpitPage } from "../../../pages/Cockpit/cockpit.page";


test.describe("Catalog MCP Sync Tests", () => {

  test.beforeEach(async ({ adminPage }) => {
      const cockpit = new CockpitPage(adminPage);
      await cockpit.navigateToCockpitMenu(catalogTestData.menuName);
  
    });

  test("TC01 - Sync MCP server to Catalog", async ({ adminPage }) => {

    const connections = new CatalogPage(adminPage);
    const data = catalogTestData;

    await connections.goToCatalog();

    await connections.openMCPCatalog();

    await connections.editCatalogEntity();

    await connections.syncFromMCPServers();

    await connections.selectMCPServer(data.syncServer);

    await connections.saveCatalogChanges();
  });



  test("TC02 - Sync MCP server from Catalog to Access Policies", async ({ adminPage }) => {

    const connections = new CatalogPage(adminPage);
    const data = catalogTestData;

    await connections.openAccessPolicies();

    await connections.syncFromCatalog();

  });



  test("TC03 - Sync MCP server in Access Policies Overrides", async ({ adminPage }) => {

    const connections = new CatalogPage(adminPage);
    const data = catalogTestData;

    await connections.openAccessPolicies();

    await connections.openAccessPolicy(data.accessPolicyCatalog);

    await connections.openPolicyMenu(data.accessPolicyCatalog);

    await connections.openMCPServer(data.mcpServerName);

    await connections.toggleMCPServer(
      `${data.mcpServerName} 477055d6-fac0-44bb-`
    );

    await connections.closePolicyDrawer();

  });

});