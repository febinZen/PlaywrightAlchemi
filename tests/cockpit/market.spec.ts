import { expect } from "@playwright/test";
import { test } from "../fixtures/roles.fixture";
import { AgentDataFactory } from "../data/agentDataFactory";
import { AgentPage } from "../../pages/Agent";
import { MarketPage } from "../../pages/Market";

test.describe("Marketplace Agent Management Tests", () => {
  let agentData: ReturnType<typeof AgentDataFactory.generateAgentData>;
  let agent: AgentPage;
  let market: MarketPage;

  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto("/spaces");
    agentData = AgentDataFactory.generateAgentData();
    agent = new AgentPage(adminPage);
    market = new MarketPage(adminPage);
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
    await agent.navigateToMarketplace();
    await agent.startCreateListing();
    await agent.openAgentDropdown();
    await market.createListingForAgent(agentData.name, "sfdsfewe4e", "febin");

    // CLEANUP: Delete agent from Marketplace
    await market.deleteListing(agentData.name);

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
    await agent.navigateToMarketplace();
    await agent.startCreateListing();
    await agent.openAgentDropdown();
    await agent.expectAgentInDropdown(agentData.name);

    //   await page.getByRole('link', { name: 'MarketPlace' }).click();
    //   await page.getByRole('button', { name: 'Create Listing' }).click();
    //   await page.getByRole('button', { name: 'Agent' }).click();
    //   await page.getByRole('combobox').filter({ hasText: 'Select an agent' }).click();
    await market.createListingForAgent(agentData.name, "sfdsfewe4e", "febin");
    await agent.startCreateListing();
    await agent.openAgentDropdown();
    await agent.expectAgentNotInDropdown(agentData.name);
    await agent.closeListingModal();

    // CLEANUP: Delete agent from Marketplace
    await market.deleteListing(agentData.name);

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
    await agent.navigateToMarketplace();
    await agent.startCreateListing();
    await agent.openAgentDropdown();
    await market.createListingForAgent(agentData.name, "sfdsfewe4e", "febin");

    // verify listing row and status
    await expect(
      adminPage.getByRole("heading", { name: agentData.name }),
    ).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(agentData.name);
    await market.expectListingStatus(agentData.name, "DRAFT");

    // CLEANUP: Delete agent from Marketplace
    await market.deleteListing(agentData.name);

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
    await agent.navigateToMarketplace();
    await agent.startCreateListing();
    await agent.openAgentDropdown();
    await agent.expectAgentInDropdown(agentData.name);

    await market.createListingForAgent(agentData.name, "sfdsfewe4e", "febin");
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

    await market.editListing(agentData.name, {
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
    await market.deleteListing(editedName);

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
    await agent.navigateToMarketplace();
    await agent.startCreateListing();
    await agent.openAgentDropdown();
    await agent.expectAgentInDropdown(agentData.name);

    await market.createListingForAgent(agentData.name, "sfdsfewe4e", "febin");

    // publish
    await market.publishListing(agentData.name);

    const row = adminPage.locator("tbody tr").filter({
      has: adminPage.locator("h3", { hasText: agentData.name }),
    });

    await expect(row).toHaveCount(1);
    await expect(
      adminPage.getByRole("heading", { name: agentData.name }),
    ).toBeVisible();
    await expect(adminPage.locator("tbody")).toContainText(agentData.name);

    await market.expectListingStatus(agentData.name, "PUBLISHED");

    // CLEANUP: Delete agent from Marketplace
    await market.deleteListing(agentData.name);

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
    await agent.navigateToMarketplace();
    await agent.startCreateListing();
    await agent.openAgentDropdown();
    await market.createListingForAgent(agentData.name, "sfdsfewe4e", "febin");

    const row = adminPage.locator("tbody tr").filter({
      has: adminPage.locator("h3", { hasText: agentData.name }),
    });

    await expect(row).toHaveCount(1);

    // CLEANUP: Delete agent from Marketplace
    await market.deleteListing(agentData.name);

    await expect(row).toHaveCount(0);

    // CLEANUP: Delete agent from agent
    await agent.navigateToAgents2();
    await agent.deleteAgent(agentData.name);
    await agent.expectAgentNotInTable(agentData.name);
  });
});
