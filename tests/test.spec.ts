import { expect } from "@playwright/test";
import { test } from "./fixtures/roles.fixture";

test.describe("Agent Management Tests", () => {
  test.beforeEach(async ({ userPage }) => {
    await userPage.goto("/spaces");
  });
  test("Admin can create and delete agent", async ({ userPage }) => {
    await userPage.getByRole("button", { name: "Marketplace" }).click();

    await userPage
      .getByRole("textbox", { name: "Search marketplace..." })
      .click();
    await userPage
      .getByRole("textbox", { name: "Search marketplace..." })
      .fill("Huma");
    await userPage
      .getByRole("heading", { name: "Humanization Editor" })
      .click();
    await userPage.getByRole("button", { name: "Just Me" }).click();
    await userPage.getByRole("button", { name: "Deploy Agent" }).click();
    await userPage.getByRole("button", { name: "New Conversation" }).click();
    await userPage
      .getByRole("button", { name: "Agent DevOPs Script Generator" })
      .click();
    await expect(
      userPage.getByRole("button", { name: "Humanization Editor" }).nth(1),
    ).toBeVisible();
    await expect(userPage.locator("#welcome-tour")).toContainText(
      "Humanization Editor",
    );
    await expect(userPage.locator("#welcome-tour")).toContainText(
      "Humanization Editor",
    );
    await expect(
      userPage.getByRole("button", { name: "Humanization Editor" }).nth(1),
    ).toBeVisible();
  });
});
