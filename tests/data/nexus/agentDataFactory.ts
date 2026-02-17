/**
 * Agent Data Factory
 * Generates unique test data for Agent tests
 */

export interface AgentData {
  name: string;
  description: string;
  systemPrompt: string;
  tags: string[];
}

export class AgentDataFactory {
  private static counter = 0;

  /**
   * Generate unique agent data for test isolation
   * Increments counter to ensure unique names across test runs
   */
  static generateAgentData(): AgentData {
    const timestamp = Date.now();
    const counter = ++this.counter;

    return {
      name: `Agent_${timestamp}_${counter}`,
      description: `Test agent description - ${timestamp}`,
      systemPrompt: `You are a test agent with ID ${timestamp}`,
      tags: ["test", `run-${counter}`],
    };
  }

  /**
   * Reset counter for fresh test runs
   */
  static resetCounter(): void {
    this.counter = 0;
  }
}
