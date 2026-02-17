import { test } from "../fixtures/roles.fixture";

import dotenv from "dotenv";

dotenv.config();

test("admin navigates to cockpit", async ({ adminPage }) => {
  const base = process.env.BASE_URL ?? "spaces";
  await adminPage.goto(base + "/cockpit");
  await test.expect(adminPage).toHaveURL(/cockpit/);
});
