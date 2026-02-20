import { test, expect } from "../../fixtures/roles.fixture";
import { CockpitPage } from "../../../pages/Cockpit/cockpit.page";
import { UsersPage } from "../../../pages/Cockpit/users/users.page";
import { USERS_TEST_DATA } from "../../data/users.testdata";

test("User Table Test", async ({ adminPage }) => {
  const users = new UsersPage(adminPage);
  const cockpit = new CockpitPage(adminPage);

  await cockpit.navigateToCockpitMenu(USERS_TEST_DATA.menuName);

  for (const header of USERS_TEST_DATA.columnHeaders) {
    await users.headerButton(header).click();
  }

  for (const rows of USERS_TEST_DATA.rowsPerPage) {
    await users.dropdown().click();
    await adminPage.getByText(`${rows} rows`, { exact: true }).click();
  }

  await users.searchBox().fill(USERS_TEST_DATA.filterOptions.searchValue);
});

