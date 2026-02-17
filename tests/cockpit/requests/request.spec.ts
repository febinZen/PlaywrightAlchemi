import { test } from '@playwright/test';
import { RequestPage } from '../../pages/requests/request.page';
import { REQUESTS_TEST_DATA } from '../../testdata/request.testdata';

test('Request Management', async ({ page }) => {

  const request = new RequestPage(page);
  await request.navigate();

  await request.openRequest(REQUESTS_TEST_DATA.request.title).click();

  await request.commentBox()
    .fill(REQUESTS_TEST_DATA.messages.comment);
});
