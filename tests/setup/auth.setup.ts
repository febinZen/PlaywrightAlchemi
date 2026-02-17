import { test as setup, expect } from "@playwright/test";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const authPath = path.resolve(__dirname, ".auth");

if (!fs.existsSync(authPath)) {
  fs.mkdirSync(authPath, { recursive: true });
}

setup("Admin login", async ({ page }) => {
  await page.goto(process.env.BASE_URL!);

  const usernameInput = page.getByTestId("username-text-input");
  const passwordInput = page.getByTestId("password-text-input");
  const submitButton = page.getByTestId("submit-button");

  // Step 1: Enter email and submit
  // await usernameInput.fill(process.env.ADMIN_EMAIL!);
  // await submitButton.click();
  await usernameInput.waitFor({ state: "visible" });
  await usernameInput.fill(process.env.ADMIN_EMAIL!);

  // Wait until button becomes enabled
  await expect(submitButton).toBeEnabled();

  await submitButton.click();
  await page
    .getByRole("textbox", { name: "Enter your email, phone, or" })
    .click();
  await page
    .getByRole("textbox", { name: "Enter your email, phone, or" })
    .fill(process.env.MY_EMAIL!);
  await page.getByRole("button", { name: "Next" }).click();
  await page.locator("#i0118").fill(process.env.MY_PASSWORD!);
  await page
    .getByRole("textbox", { name: "Enter the password for febin." })
    .click({
      modifiers: ["ControlOrMeta"],
    });
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("button", { name: "No" }).click();

  // // Step 2: Wait for password input to appear and be interactable
  // await passwordInput.waitFor({ state: "visible" });
  // // await passwordInput.focus(); // ensures it's ready for typing
  // await passwordInput.fill(process.env.ADMIN_PASSWORD!);
  // await page.locator('[data-test-id="febin.intern@zentience.co"]').click();
  // // Step 3: Submit password and wait for navigation
  await Promise.all([
    page.waitForURL(/\/spaces$/), // waits until the URL matches
    // submitButton.click(),
  ]);

  // Step 4: Save the session state
  await page.context().storageState({
    path: path.join(authPath, "admin.json"),
  });
});
setup("User login", async ({ page }) => {
  await page.goto(process.env.BASE_URL + "/login");
  const usernameInput = page.getByTestId("username-text-input");
  const passwordInput = page.getByTestId("password-text-input");
  const submitButton = page.getByTestId("submit-button");
  // await usernameInput.fill(process.env.USER_EMAIL!);
  // await submitButton.click();
  await usernameInput.waitFor({ state: "visible" });
  await usernameInput.fill(process.env.USER_EMAIL!);

  // Wait until button becomes enabled
  await expect(submitButton).toBeEnabled();

  await submitButton.click();

  await submitButton.click();
  await usernameInput.waitFor({ state: "visible" });
  await passwordInput.fill(process.env.USER_PASSWORD!);
  await expect(submitButton).toBeEnabled();
  await submitButton.click();
  await Promise.all([
    page.waitForURL(/\/spaces$/), // waits until the URL matches
    // submitButton.click(),
  ]);

  await page.context().storageState({
    path: path.join(authPath, "user.json"),
  });
});
