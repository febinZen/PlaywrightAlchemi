import { test, expect } from "../../fixtures/roles.fixture";
import { UserRequestPage } from "../../../pages/Cockpit/request/create-request.page";
import { CockpitRequestPage } from "../../../pages/Cockpit/request/request.page";
import {
  CREDIT_REQUEST_DATA,
  REQUEST_PRIORITY_DATA,
} from "../../data/request.testdata";

test("User creates Credit Request → Admin sees it in Cockpit", async ({
  userPage,
  adminPage,
}) => {
  // =====================================
  // 👤 USER CREATES REQUEST
  // =====================================
  await adminPage.goto("/spaces");
  await userPage.goto("/spaces");
  const userRequest = new UserRequestPage(userPage);
  const cockpit = new CockpitRequestPage(adminPage);

  await userRequest.openHelpAndSupport();

  // await userRequest.selectType('Issue');
  await userRequest.selectType(CREDIT_REQUEST_DATA.type);

  await userRequest.fillSubject(CREDIT_REQUEST_DATA.subject);
  await userRequest.fillDescription(CREDIT_REQUEST_DATA.description);
  await userRequest.fillCredits(CREDIT_REQUEST_DATA.credits);

  await userRequest.submit();
  await userRequest.goToSpaces();

  // =====================================
  // 🔐 ADMIN VALIDATES IN COCKPIT
  // =====================================
  const cockpitRequests = new CockpitRequestPage(adminPage);

  await cockpitRequests.navigate();

  await adminPage.waitForLoadState("networkidle");
  await cockpit.searchRequest(CREDIT_REQUEST_DATA.subject);

  await expect(cockpit.requestRow(CREDIT_REQUEST_DATA.subject)).toBeVisible();
});
