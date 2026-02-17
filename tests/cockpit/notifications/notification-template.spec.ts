import { test } from '@playwright/test';
import { NotificationTemplatePage } from '../../pages/notifications/notification-template.page';
import { NOTIFICATIONS_TEST_DATA } from '../../testdata/notification-template.testdata';

test('Notification Templates Test', async ({ page }) => {

  const notify = new NotificationTemplatePage(page);
  await notify.navigate();

  for (const header of NOTIFICATIONS_TEST_DATA.columnHeaders) {
    await notify.headerButton(header).click();
  }

  await notify.searchBox().fill(
    NOTIFICATIONS_TEST_DATA.searchQuery
  );
});
