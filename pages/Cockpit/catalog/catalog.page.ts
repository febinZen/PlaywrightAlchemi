import { Page } from "@playwright/test";

export class CatalogPage {

  constructor(private page: Page) {}

  async goToCatalog() {
  await this.page.getByRole("link", { name: "Catalog" }).click();
}

async openMCPCatalog() {
  await this.page
    .locator("div")
    .filter({ hasText: /^MCP ServersMCP- Model Context Protocol servers$/ })
    .first()
    .click();
}

async editCatalogEntity() {
  await this.page.getByRole("button", { name: "Edit Entity" }).nth(1).click();
}

async syncFromMCPServers() {
  await this.page.getByRole("button", { name: "Sync from MCP Servers" }).click();
}

async selectMCPServer(serverName: string) {
  await this.page.getByRole("cell", { name: serverName }).click();
}

async saveCatalogChanges() {
  await this.page.getByRole("button", { name: "Save Changes" }).click();
}

async openAccessPolicies() {
  await this.page.getByRole("link", { name: "Access Policies" }).click();
}

async syncFromCatalog() {
  await this.page.getByRole("button", { name: "Sync from Catalog" }).click();
}

async openAccessPolicy(policyName: string) {
  await this.page.getByRole("cell", { name: policyName }).click();
}

async openPolicyMenu(policyName: string) {
  await this.page
    .getByRole("row", { name: policyName })
    .getByRole("button")
    .click();
}

async openMCPServer(serverName: string) {
  await this.page.getByRole("cell", { name: serverName }).click();
}

async toggleMCPServer(serverRow: string) {
  await this.page
    .getByRole("row", { name: serverRow })
    .getByRole("switch")
    .click();
}

async closePolicyDrawer() {
  await this.page.getByRole("button", { name: "Close" }).click();
}
}
  