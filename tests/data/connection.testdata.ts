export const connectionsTestData = {
  menuName: "Connections",

  mcpTool: {
    toolName: "BrowerAct",
    editedName: "Browser ACT",

    description:
      "An AI web scraping and browser automation tool that integrates with various AI assistants.",

    url: "https://mcp.so/server/browseract/BrowserAct",

    config: `{
  "mcpServers": {
    "browseract": {
      "url": "<BROWSERACT_MCP_SERVER_URL>",
      "headers": {
        "Authorization": "Bearer <BROWSERACT_API_KEY>"
      }
    }
  }
}`,
  },

  

  openApi: {
    name: "Copilot",
    specUrl: "https://github.com/features/copilot",
  },
};
