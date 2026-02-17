import { test, expect } from '@playwright/test';
import { UsersPage } from '../../../pages/users/users.page';
import { USERS_TEST_DATA } from '../../testdata/users.testdata';

test('User Table Test', async ({ page }) => {

  const users = new UsersPage(page);
  await users.navigate();

  for (const header of USERS_TEST_DATA.columnHeaders) {
    await users.headerButton(header).click();
  }

  for (const rows of USERS_TEST_DATA.rowsPerPage) {
    await users.dropdown().click();
    await page.getByText(`${rows} rows`, { exact: true }).click();
  }

  await users.searchBox().fill(
    USERS_TEST_DATA.filterOptions.searchValue
  );
});
