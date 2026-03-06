import { test, expect } from "../../fixtures/roles.fixture";
import { ConnectionsPage } from "../../../pages/Cockpit/connections/connections.page";
import { connectionsTestData } from "../../data/connection.testdata";
import { CockpitPage } from "../../../pages/Cockpit/cockpit.page";

test.describe("Connections Module", () => {
   
test.beforeEach(async ({ adminPage }) => {
    const cockpit = new CockpitPage(adminPage);
    await cockpit.navigateToCockpitMenu(connectionsTestData.menuName);
  });

  test("TC01 - Add MCP Tool", async ({ adminPage }) => {

    const connections = new ConnectionsPage(adminPage);
    const data = connectionsTestData.mcpTool;

    

    await connections.clickAddMCP();

    await connections.enterToolName(data.toolName);

    await connections.enterDescription(data.description);

    await connections.enterURL(data.url);

    await connections.importConfig(data.config);

    await connections.validateMCP();

    await connections.enableDefault();

    await connections.addMCPTool();

    
  });

   test("TC02 - Edit and Delete MCP Tool", async ({ adminPage }) => {

    const connections = new ConnectionsPage(adminPage);
    const data = connectionsTestData.mcpTool;

    

    await connections.editMCPTool(connectionsTestData.mcpTool.toolName);

    await connections.enterToolName(data.editedName);

    

    await connections.addMCPTool();

    await connections.removeMCPTool(connectionsTestData.mcpTool.toolName);
  });



  test("TC03 - Add OpenAPI Spec", async ({ adminPage }) => {

    const connections = new ConnectionsPage(adminPage);

    

    await connections.openConnection(
      connectionsTestData.mcpTool.toolName
    );

    await connections.openOpenAPITab();

    await connections.clickAddOpenAPI();

    await connections.enterOpenAPIName(
      connectionsTestData.openApi.name
    );

    await connections.enterSpecURL(
      connectionsTestData.openApi.specUrl
    );

    await connections.validateSpec();

    await connections.addSpec();
  });


  test("TC03 - Navigate to Integrations", async ({ adminPage }) => {

    const connections = new ConnectionsPage(adminPage);

    

    await connections.goToIntegrations();
  });

});