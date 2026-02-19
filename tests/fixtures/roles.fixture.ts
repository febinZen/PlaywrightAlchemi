import { test as base, Page, expect } from "@playwright/test";
import path from "path";

type RoleFixtures = {
  adminPage: Page;
  userPage: Page;
  ownerA: Page;
};

const adminStorage = path.resolve(__dirname, "../setup/.auth/admin.json");
const userStorage = path.resolve(__dirname, "../setup/.auth/user.json");
const user02Storage = path.resolve(__dirname, "../setup/.auth/user_02.json");

export const test = base.extend<RoleFixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: adminStorage,
    });
    const page = await context.newPage();
    await page.goto("/spaces");
    await use(page);
    await context.close();
  },
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: userStorage,
    });
    const page = await context.newPage();
    await page.goto("/spaces");
    await use(page);
    await context.close();
  },
  ownerA: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: user02Storage,
    });
    const page = await context.newPage();
    await page.goto("/spaces");
    await use(page);
    await context.close();
  },
});
export { expect };
