import { Page } from "@playwright/test";

export class ConnectionsPage {

  constructor(private page: Page) {}

  async goToConnections() {
    await this.page.getByRole("link", { name: "Connections" }).click();
  }

  async clickAddMCP() {
    await this.page.getByRole("button", { name: "Add MCP" }).click();
  }

  async enterToolName(toolName: string) {
    await this.page.getByRole("textbox", { name: "Tool Name *" }).fill(toolName);
  }

  async enterDescription(description: string) {
    await this.page
      .getByRole("textbox", { name: "Description for AI Agent" })
      .fill(description);
  }

  async enterURL(url: string) {
    await this.page.getByRole("textbox", { name: "URL *" }).fill(url);
  }

  async importConfig(config: string) {

    await this.page.getByRole("button", { name: "Import Config" }).click();

    await this.page
      .getByRole("textbox", { name: '{ "server-name": { "command' })
      .fill(config);

    await this.page.getByRole("button", { name: "Import & Parse" }).click();
  }

  async validateMCP() {
    await this.page.getByRole("button", { name: "Validate" }).click();
  }

  async enableDefault() {
    await this.page.getByRole("switch", { name: "Default" }).click();
  }

  async addMCPTool() {
    await this.page.getByRole("button", { name: "Add MCP Tool" }).click();
  }

  async editMCPTool(mcpname: string){
    await this.page.getByRole('heading', { name: mcpname }).click();
    await this.page.getByRole('tabpanel', { name: 'MCP' }).getByRole('button').first().click();
  }

  async removeMCPTool(mcpname: string){
    await this.page.getByRole('heading', { name: mcpname }).click();
    await this.page.getByRole('tabpanel', { name: 'MCP' }).getByRole('button').nth(1).click();
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }

  async openConnection(toolName: string) {
    await this.page.getByRole("heading", { name: toolName }).click();
  }

  async openOpenAPITab() {
    await this.page.getByRole("tab", { name: "OpenAPI" }).click();
  }

  async clickAddOpenAPI() {
    await this.page.getByRole("button", { name: "Add OpenAPI" }).click();
  }

  

  async enterOpenAPIName(name: string) {
    await this.page.getByRole("textbox", { name: "IMDB API" }).fill(name);
  }

  async enterSpecURL(url: string) {
    await this.page
      .getByRole("textbox", { name: "https://example.com/openapi." })
      .fill(url);
  }

  async validateSpec() {
    await this.page.getByRole("button", { name: "Validate Spec" }).click();
  }

  async addSpec() {
    await this.page.getByRole("button", { name: "Add Spec" }).click();
  }

  async goToIntegrations() {
    await this.page.getByRole("tab", { name: "Integrations" }).click();
  }
}
  