// import { test as base, Page } from "@playwright/test";

// type RoleFixtures = {
//   adminPage: Page;
//   //   userPage: Page;
// };

// export const test = base.extend<RoleFixtures>({
//   adminPage: async ({ browser }, use) => {
//     const context = await browser.newContext({
//       storageState: "auth/admin.json",
//     });
//     const page = await context.newPage();
//     await use(page);
//     await context.close();
//   },

//   //   userPage: async ({ browser }, use) => {
//   //     const context = await browser.newContext({
//   //       storageState: 'auth/user.json',
//   //     });
//   //     const page = await context.newPage();
//   //     await use(page);
//   //     await context.close();
//   //   },
// });

import { test as base, Page } from "@playwright/test";
import path from "path";

type RoleFixtures = {
  adminPage: Page;
  userPage: Page;
};

const adminStorage = path.resolve(__dirname, "../setup/.auth/admin.json");
const userStorage = path.resolve(__dirname, "../setup/.auth/user.json");

export const test = base.extend<RoleFixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: adminStorage,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: userStorage,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});
