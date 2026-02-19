import { test, expect } from "../../fixtures/roles.fixture";
import { NotificationTemplatePage } from "../../../pages/notifications/notifications-template.page";
import { NOTIFICATIONS_TEST_DATA } from "../../data/notification-template.testdata";

test("Notification Templates Test", async ({ adminPage }) => {
  const notify = new NotificationTemplatePage(adminPage);
  await notify.navigate();

  for (const header of NOTIFICATIONS_TEST_DATA.columnHeaders) {
    await notify.headerButton(header).click();
  }

  await notify.searchBox().fill(NOTIFICATIONS_TEST_DATA.searchQuery);
});
