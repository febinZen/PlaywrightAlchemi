/**
 * Workspace Data Factory
 * Generates mock workspace data for testing
 */
export class WorkspaceDataFactory {
  /**
   * Generate random workspace data
   */
  static generateWorkspaceData() {
    const timestamp = Date.now();
    return {
      name: `workspace_${timestamp}`,
      description: `Test workspace description ${timestamp}`,
      type: "Software Product Lifecycle",
    };
  }

  /**
   * Generate workspace data with custom name
   */
  static generateWorkspaceDataWithName(name: string) {
    return {
      name,
      description: `Test workspace description for ${name}`,
      type: "Software Product Lifecycle",
    };
  }

  /**
   * Generate workspace data with all custom fields
   */
  static generateCustomWorkspaceData(
    name: string,
    description: string,
    type: string = "Software Product Lifecycle",
  ) {
    return {
      name,
      description,
      type,
    };
  }
}
