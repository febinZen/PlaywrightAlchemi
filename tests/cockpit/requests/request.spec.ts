import { test } from '@playwright/test';
import { CockpitRequestPage } from '../../../pages/request/request.page';
import { REQUESTS_TEST_DATA } from '../../data/request.testdata';

test('Request Management', async ({ page }) => {

  const request = new CockpitRequestPage(page);
  await request.navigate();

  await request.openRequest(REQUESTS_TEST_DATA.request.title);

  await request.commentBox()
    .fill(REQUESTS_TEST_DATA.messages.comment);
});

