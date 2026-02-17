import { expect } from "@playwright/test";
import { test } from "../fixtures/roles.fixture";
import { AgentPage } from "../../pages/Agent";
import { AgentDataFactory } from "../data/agentDataFactory";

test.describe("Agent Management Tests", () => {
  let agentData: ReturnType<typeof AgentDataFactory.generateAgentData>;
  let agent: AgentPage;

  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto("/spaces");
    agentData = AgentDataFactory.generateAgentData();
    agent = new AgentPage(adminPage);
    await agent.navigateToAgents();
  });
  test("Admin can create and delete agent", async ({ adminPage }) => {
    // CREATE AGENT
    await agent.createAgent(
      agentData.name,
      agentData.description,
      agentData.systemPrompt,
      agentData.tags,
    );

    // VERIFY CREATED
    await agent.expectAgentExists(agentData.name);
    await agent.expectAgentInTable(agentData.name);
    await agent.expectAgentActive(agentData.name);

    // DEACTIVATE
    await agent.deactivateAgent(agentData.name);
    await agent.expectAgentInactive(agentData.name);

    // REACTIVATE
    await agent.reactivateAgent(agentData.name);
    await agent.expectAgentActive(agentData.name);

    // DELETE
    await agent.deleteAgent(agentData.name);
    await agent.expectAgentNotInTable(agentData.name);
  });

  test("Admin can edit agent details", async ({ adminPage }) => {
    // CREATE AGENT
    await agent.createAgent(
      agentData.name,
      agentData.description,
      agentData.systemPrompt,
      agentData.tags,
    );

    // VERIFY AGENT CREATED
    await agent.expectAgentExists(agentData.name);
    await agent.expectAgentInTable(agentData.name);

    // EDIT AGENT
    const editedName = `${agentData.name}_edited`;
    const editedDescription = `${agentData.description}_updated`;

    await agent.openEditForm(agentData.name);
    await agent.updateAgent(editedName, editedDescription);

    // VERIFY CHANGES
    await agent.expectAgentExists(editedName);
    await agent.expectAgentInTable(editedName);
    await expect(adminPage.locator("tbody")).toContainText(editedDescription);

    // //   // REACTIVATE
    // await agent.reactivateAgent(agentData.name);
    // await agent.expectAgentActive(agentData.name);

    // CLEANUP: Delete agent
    await agent.deleteAgent(editedName);
    await agent.expectAgentNotInTable(editedName);
  });

  test("Admin can activate/deactivate agent and verify marketplace filtering", async ({
    page,
  }) => {
    // CREATE AGENT
    await agent.createAgent(
      agentData.name,
      agentData.description,
      agentData.systemPrompt,
      agentData.tags,
    );

    // VERIFY CREATED IN TABLE
    await agent.expectAgentExists(agentData.name);
    await agent.expectAgentInTable(agentData.name);

    // DEACTIVATE AGENT
    await agent.deactivateAgent(agentData.name);
    await agent.expectAgentInactive(agentData.name);

    // VERIFY DEACTIVATED AGENT NOT IN MARKETPLACE DROPDOWN
    await agent.navigateToMarketplace();
    await agent.startCreateListing();
    await agent.openAgentDropdown();
    await agent.expectAgentNotInDropdown(agentData.name);
    await agent.closeListingModal();

    // REACTIVATE AGENT
    await agent.navigateToAgents2();
    await agent.reactivateAgent(agentData.name);
    await agent.expectAgentActive(agentData.name);

    // VERIFY REACTIVATED AGENT APPEARS IN MARKETPLACE DROPDOWN
    await agent.navigateToMarketplace();
    await agent.startCreateListing();
    await agent.openAgentDropdown();
    await agent.expectAgentInDropdown(agentData.name);
    await agent.closeListingModal();

    // CLEANUP: Delete agent
    await agent.navigateToAgents2();
    await agent.deleteAgent(agentData.name);
    await agent.expectAgentNotInTable(agentData.name);
  });
});
