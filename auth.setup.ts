import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { chromium, FullConfig } from "@playwright/test";

dotenv.config();

const authPath = path.resolve(__dirname, ".auth");

if (!fs.existsSync(authPath)) {
  fs.mkdirSync(authPath, { recursive: true });
}

async function globalSetup(config: FullConfig) {

  const browser = await chromium.launch();

  // ==========================
  // ADMIN LOGIN
  // ==========================
  const adminPage = await browser.newPage();

  await adminPage.goto(process.env.BASE_URL!);

  await adminPage.getByTestId("username-text-input")
    .fill(process.env.ADMIN_EMAIL!);

  await adminPage.getByTestId("submit-button").click();

  await adminPage.getByRole("textbox", { name: /email|phone/i })
    .fill(process.env.ADMIN_EMAIL!);

  await adminPage.getByRole("button", { name: "Next" }).click();

  await adminPage.getByRole("textbox", { name: /password/i })
    .fill(process.env.ADMIN_PASSWORD!);

  await adminPage.getByRole("button", { name: "Sign in" }).click();
  await adminPage.getByRole("button", { name: "Yes" }).click();

  await adminPage.waitForURL("**/spaces");

  await adminPage.context().storageState({
    path: path.join(authPath, "admin.json"),
  });

  await adminPage.close();

  // ==========================
  // USER LOGIN
  // ==========================
  const userPage = await browser.newPage();

  await userPage.goto(process.env.BASE_URL + "/login");

  await userPage.getByTestId("username-text-input")
    .fill(process.env.USER_EMAIL!);

  await userPage.getByTestId("submit-button").click();

  await userPage.getByTestId("password-text-input")
    .fill(process.env.USER_PASSWORD!);

  await userPage.getByTestId("submit-button").click();

  await userPage.waitForURL("**/spaces");

  await userPage.context().storageState({
    path: path.join(authPath, "user.json"),
  });

  await userPage.close();

  await browser.close();
}

export default globalSetup;
