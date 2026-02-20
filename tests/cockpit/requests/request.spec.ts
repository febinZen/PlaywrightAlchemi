import { test, expect } from "../../fixtures/roles.fixture";
import { CockpitRequestPage } from "../../../pages/Cockpit/request/request.page";
import { REQUESTS_TEST_DATA } from "../../data/request.testdata";

test("Request Management", async ({ adminPage }) => {
  const request = new CockpitRequestPage(adminPage);
  await request.navigate();

  await request.openRequest(REQUESTS_TEST_DATA.request.title);

  await request.commentBox().fill(REQUESTS_TEST_DATA.messages.comment);
});
// give me the breadcrumbs design for this test case in a simple format
// Admin > Cockpit > Requests > Open Request
//   - Navigate to Requests Page
//   - Open a specific request by title
//   - Fill the comment box with a message
