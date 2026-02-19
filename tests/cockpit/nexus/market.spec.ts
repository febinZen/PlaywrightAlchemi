import { test, expect } from "../../fixtures/roles.fixture";
import { AgentDataFactory } from "../../data/nexus/agentDataFactory";
import { AgentPage } from "../../../pages/nexus/Agent";
import { MarketplacePage } from "../../../pages/nexus/Marketplace";
import { PublicMarketplacePage } from "../../../pages/nexus/PublicMarketplace";

test.describe("Marketplace Agent Management Tests", () => {
  let agentData: ReturnType<typeof AgentDataFactory.generateAgentData>;
  let agent: AgentPage;
  let marketplace: MarketplacePage;

  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto("/spaces");
    agentData = AgentDataFactory.generateAgentData();
    agent = new AgentPage(adminPage);
    marketplace = new MarketplacePage(adminPage);
    await agent.navigateToAgents();
  });

  test("Newly created (non-published & Active) agent appears in Create Listing dropdown", async ({
    adminPage,
  }) => {
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

    // VERIFY REACTIVATED AGENT APPEARS IN MARKETPLACE DROPDOWN & CREATE LISTING
    await marketplace.navigateToMarketplace();
    await marketplace.startCreateListing();
    await marketplace.openAgentDropdown();
    await marketplace.createListingForAgent(
      agentData.name,
      "sfdsfewe4e",
      "febin",
    );

    // CLEANUP: Delete agent from Marketplace
    await marketplace.deleteListing(agentData.name);

    // CLEANUP: Delete agent from agent
    await agent.navigateToAgents2();
    await agent.deleteAgent(agentData.name);
    await agent.expectAgentNotInTable(agentData.name);
  });
  test("Agent disappears from Create Listing after listing is created", async ({
    adminPage,
  }) => {
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

    // VERIFY REACTIVATED AGENT APPEARS IN MARKETPLACE DROPDOWN
    await marketplace.navigateToMarketplace();
    await marketplace.startCreateListing();
    await marketplace.openAgentDropdown();
    await marketplace.expectAgentInDropdown(agentData.name);

    //   await page.getByRole('link', { name: 'MarketPlace' }).click();
    //   await page.getByRole('button', { name: 'Create Listing' }).click();
    //   await page.getByRole('button', { name: 'Agent' }).click();
    //   await page.getByRole('combobox').filter({ hasText: 'Select an agent' }).click();
    await marketplace.createListingForAgent(
      agentData.name,
      "sfdsfewe4e",
      "febin",
    );
    await marketplace.startCreateListing();
    await marketplace.openAgentDropdown();
    await marketplace.expectAgentNotInDropdown(agentData.name);
    await marketplace.closeListingModal();

    // CLEANUP: Delete agent from Marketplace
    await marketplace.deleteListing(agentData.name);

    // CLEANUP: Delete agent from agent
    await agent.navigateToAgents2();
    await agent.deleteAgent(agentData.name);
    await agent.expectAgentNotInTable(agentData.name);
  });

  test("Creating listing sets status to Draft", async ({ adminPage }) => {
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

    // VERIFY REACTIVATED AGENT APPEARS IN MARKETPLACE DROPDOWN & CREATE LISTING
    await marketplace.navigateToMarketplace();
    await marketplace.startCreateListing();
    await marketplace.openAgentDropdown();
    await marketplace.createListingForAgent(
      agentData.name,
      "sfdsfewe4e",
      "febin",
    );

    // verify listing row and status
    await expect(
      adminPage.getByRole("heading", { name: agentData.name }),
    ).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(agentData.name);
    await marketplace.expectListingStatus(agentData.name, "DRAFT");

    // CLEANUP: Delete agent from Marketplace
    await marketplace.deleteListing(agentData.name);

    // CLEANUP: Delete agent from agent
    await agent.navigateToAgents2();
    await agent.deleteAgent(agentData.name);
    await agent.expectAgentNotInTable(agentData.name);
  });

  test("Admin can Creating listing sets and edit listing", async ({
    adminPage,
  }) => {
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

    // VERIFY REACTIVATED AGENT APPEARS IN MARKETPLACE DROPDOWN
    await marketplace.navigateToMarketplace();
    await marketplace.startCreateListing();
    await marketplace.openAgentDropdown();
    await marketplace.expectAgentInDropdown(agentData.name);

    await marketplace.createListingForAgent(
      agentData.name,
      "sfdsfewe4e",
      "febin",
    );
    const row = adminPage.locator("tbody tr").filter({
      has: adminPage.locator("h3", { hasText: agentData.name }),
    });

    await expect(row).toHaveCount(1);
    await expect(
      adminPage.getByRole("heading", { name: agentData.name }),
    ).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(agentData.name);

    const editedName = `${agentData.name}_edited`;
    const editedDescription = `${agentData.description}_updated`;

    await marketplace.editListing(agentData.name, {
      title: editedName,
      shortDescription: editedDescription,
      pricingOption: "Freemium",
      featured: true,
    });

    await expect(
      adminPage.getByRole("heading", { name: editedName }),
    ).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(editedName);
    await expect(adminPage.locator("tbody")).toContainText(editedDescription);

    // CLEANUP: Delete agent from Marketplace
    await marketplace.deleteListing(editedName);

    // CLEANUP: Delete agent from agent
    await agent.navigateToAgents2();
    await agent.deleteAgent(agentData.name);
    await agent.expectAgentNotInTable(agentData.name);
  });

  test(" Admin can publish Draft listing", async ({ adminPage }) => {
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

    // VERIFY REACTIVATED AGENT APPEARS IN MARKETPLACE DROPDOWN
    await marketplace.navigateToMarketplace();
    await marketplace.startCreateListing();
    await marketplace.openAgentDropdown();
    await marketplace.expectAgentInDropdown(agentData.name);

    await marketplace.createListingForAgent(
      agentData.name,
      "sfdsfewe4e",
      "febin",
    );

    // publish
    await marketplace.publishListing(agentData.name);

    const row = adminPage.locator("tbody tr").filter({
      has: adminPage.locator("h3", { hasText: agentData.name }),
    });

    await expect(row).toHaveCount(1);
    await expect(
      adminPage.getByRole("heading", { name: agentData.name }),
    ).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(agentData.name);

    await marketplace.expectListingStatus(agentData.name, "PUBLISHED");

    // CLEANUP: Delete agent from Marketplace
    await marketplace.deleteListing(agentData.name);

    // CLEANUP: Delete agent from agent
    await agent.navigateToAgents2();
    await agent.deleteAgent(agentData.name);
    await agent.expectAgentNotInTable(agentData.name);
  });

  test(" Admin can delete listing", async ({ adminPage }) => {
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

    // VERIFY REACTIVATED AGENT APPEARS IN MARKETPLACE DROPDOWN & CREATE LISTING
    await marketplace.navigateToMarketplace();
    await marketplace.startCreateListing();
    await marketplace.openAgentDropdown();
    await marketplace.createListingForAgent(
      agentData.name,
      "sfdsfewe4e",
      "febin",
    );

    const row = adminPage.locator("tbody tr").filter({
      has: adminPage.locator("h3", { hasText: agentData.name }),
    });

    await expect(row).toHaveCount(1);

    // CLEANUP: Delete agent from Marketplace
    await marketplace.deleteListing(agentData.name);

    await expect(row).toHaveCount(0);

    // CLEANUP: Delete agent from agent
    await agent.navigateToAgents2();
    await agent.deleteAgent(agentData.name);
    await agent.expectAgentNotInTable(agentData.name);
  });

  test(" Draft listing NOT visible to normal users", async ({
    adminPage,
    userPage,
  }) => {
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

    // VERIFY REACTIVATED AGENT APPEARS IN MARKETPLACE DROPDOWN
    await marketplace.navigateToMarketplace();
    await marketplace.startCreateListing();
    await marketplace.openAgentDropdown();
    await marketplace.expectAgentInDropdown(agentData.name);

    await marketplace.createListingForAgent(
      agentData.name,
      "sfdsfewe4e",
      "febin",
    );

    //draft
    const row = adminPage.locator("tbody tr").filter({
      has: adminPage.locator("h3", { hasText: agentData.name }),
    });

    await expect(row).toHaveCount(1);
    await expect(
      adminPage.getByRole("heading", { name: agentData.name }),
    ).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(agentData.name);

    await marketplace.expectListingStatus(agentData.name, "DRAFT");
    // verify by user - agent should not be visible in marketplace
    const publicMarketplace = new PublicMarketplacePage(userPage);
    await publicMarketplace.verifyAgentNotFound(agentData.name);
    // CLEANUP: Delete agent from Marketplace
    await marketplace.deleteListing(agentData.name);

    // CLEANUP: Delete agent from agent
    await agent.navigateToAgents2();
    await agent.deleteAgent(agentData.name);
    await agent.expectAgentNotInTable(agentData.name);
  });
  test("Published listing visible to all users in same organization", async ({
    adminPage,
    userPage,
  }) => {
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

    // VERIFY REACTIVATED AGENT APPEARS IN MARKETPLACE DROPDOWN
    await marketplace.navigateToMarketplace();
    await marketplace.startCreateListing();
    await marketplace.openAgentDropdown();
    await marketplace.expectAgentInDropdown(agentData.name);

    await marketplace.createListingForAgent(
      agentData.name,
      "sfdsfewe4e",
      "febin",
    );

    // publish
    await marketplace.publishListing(agentData.name);

    const row = adminPage.locator("tbody tr").filter({
      has: adminPage.locator("h3", { hasText: agentData.name }),
    });

    await expect(row).toHaveCount(1);
    await expect(
      adminPage.getByRole("heading", { name: agentData.name }),
    ).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(agentData.name);

    await marketplace.expectListingStatus(agentData.name, "PUBLISHED");
    // verify by user - agent should not be visible in marketplace
    const publicMarketplace = new PublicMarketplacePage(userPage);
    await publicMarketplace.verifyAgentFound(agentData.name);

    // CLEANUP: Delete agent from Marketplace
    await marketplace.deleteListing(agentData.name);

    // CLEANUP: Delete agent from agent
    await agent.navigateToAgents2();
    await agent.deleteAgent(agentData.name);
    await agent.expectAgentNotInTable(agentData.name);
  });
});
