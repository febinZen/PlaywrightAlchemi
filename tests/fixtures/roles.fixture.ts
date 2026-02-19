import { test as base, Page } from '@playwright/test';
import path from 'path';

type RoleFixtures = {
  adminPage: Page;
  userPage: Page;
};

const adminStorage = path.resolve(
  __dirname,
  '../.auth/admin.json'
);

const userStorage = path.resolve(
  __dirname,
  '../.auth/user.json'
);

export const test = base.extend<RoleFixtures>({

  // 🔐 ADMIN FIXTURE
  adminPage: async ({ browser }, use) => {

    const context = await browser.newContext({
      storageState: adminStorage,
      baseURL: process.env.BASE_URL,
    });

    const page = await context.newPage();

    await page.goto('/spaces');

    await use(page);

    await context.close();
  },

  // 👤 USER FIXTURE
  userPage: async ({ browser }, use) => {

    const context = await browser.newContext({
      storageState: userStorage,
      baseURL: process.env.BASE_URL,
    });

    const page = await context.newPage();

    await page.goto('/spaces');

    await use(page);

    await context.close();
  },

});

export { expect } from '@playwright/test';
