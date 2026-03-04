import { test, expect } from "../../fixtures/roles.fixture";
import { CockpitPage } from '../../../pages/Cockpit/cockpit.page';
import { UserTablePage } from '../../../pages/Cockpit/users/invide-user.page';
import { INVITE_TEST_DATA, USERS_TEST_DATA } from '../../data/users.testdata';

test.describe('User Table - Invite & Access Flow', () => {

 test('TC01 - Invite Two Users', async ({ adminPage }) => {
  const user = new UserTablePage(adminPage);
  const cockpit = new CockpitPage(adminPage);

  await cockpit.navigateToCockpitMenu(USERS_TEST_DATA.menuName);

  const emails = INVITE_TEST_DATA.inviteUser.email;

  for (const email of emails) {
    await user.clickInviteUser();
    await user.fillEmail(email);
    await user.selectRole(INVITE_TEST_DATA.inviteUser.role);
    await user.sendInvitation();
  }

  await user.goToInvites();

  for (const email of emails) {
    await user.verifyUserVisible(email);
  }
});

 test('TC02 - Accept First User Invitation', async ({ adminPage }) => {
  const cockpit = new CockpitPage(adminPage);
  const user = new UserTablePage(adminPage);

  await cockpit.navigateToCockpitMenu(USERS_TEST_DATA.menuName);
  await user.goToInvites();

  const firstEmail = INVITE_TEST_DATA.inviteUser.email[0];

  await user.acceptInvite(firstEmail);

  await expect(
    adminPage.getByText(firstEmail)
  ).toBeVisible();
});

  test('TC03 - Reject Second User Invitation', async ({ adminPage }) => {
  const cockpit = new CockpitPage(adminPage);
  const user = new UserTablePage(adminPage);

  await cockpit.navigateToCockpitMenu(USERS_TEST_DATA.menuName);
  await user.goToInvites();

  const secondEmail = INVITE_TEST_DATA.inviteUser.email[1];

  await user.rejectInvite(secondEmail);
});

});



