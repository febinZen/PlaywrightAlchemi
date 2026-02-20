import { test as setup, expect, Page } from "@playwright/test";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const authPath = path.resolve(__dirname, ".auth");

if (!fs.existsSync(authPath)) {
  fs.mkdirSync(authPath, { recursive: true });
}

async function login(page: Page, email: string, password: string) {
  await page.goto(process.env.BASE_URL + "/login");

  const usernameInput = page.getByTestId("username-text-input");
  const passwordInput = page.getByTestId("password-text-input");
  const submitButton = page.getByTestId("submit-button");

  await usernameInput.waitFor({ state: "visible" });
  await usernameInput.fill(email);
  await expect(usernameInput).toHaveValue(email);

  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Wait for either Microsoft login OR normal password field
  const microsoftEmailLocator = page.getByRole("textbox", {
    name: /enter your email/i,
  });

  const normalPasswordLocator = passwordInput;

  const loginType = await Promise.race([
    microsoftEmailLocator.waitFor({ state: "visible" }).then(() => "microsoft"),
    normalPasswordLocator.waitFor({ state: "visible" }).then(() => "normal"),
  ]);

  if (loginType === "microsoft") {
    // Microsoft email already auto-filled sometimes, but we fill again safely
    await microsoftEmailLocator.fill(email);
    await page.getByRole("button", { name: /next/i }).click();

    const msPassword = page.locator("#i0118");
    await msPassword.waitFor({ state: "visible" });
    await msPassword.fill(password);

    await page.getByRole("button", { name: /sign in/i }).click();

    // Handle optional "Stay signed in?"
    try {
      // More stable selector than button text
      await page.waitForSelector("#idBtn_Back", { timeout: 5000 });
      await page.locator("#idBtn_Back").click();
    } catch {
      // Screen did not appear — continue
    }
  } else {
    // Normal Login Flow
    await normalPasswordLocator.fill(password);
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
  }

  await page.waitForURL(/\/spaces$/, { timeout: 30000 });
}

setup("Admin login", async ({ page }) => {
  await login(page, process.env.ADMIN_EMAIL!, process.env.MY_PASSWORD!);

  await page.context().storageState({
    path: path.join(authPath, "admin.json"),
  });
});

setup("User login", async ({ page }) => {
  await login(page, process.env.USER_EMAIL!, process.env.USER_PASSWORD!);

  await page.context().storageState({
    path: path.join(authPath, "user.json"),
  });
});

setup("User_02 login", async ({ page }) => {
  await login(page, process.env.USER_EMAIL_02!, process.env.USER_PASSWORD_02!);

  await page.context().storageState({
    path: path.join(authPath, "user_02.json"),
  });
});
