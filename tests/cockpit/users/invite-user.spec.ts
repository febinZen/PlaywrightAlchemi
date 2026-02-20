import { test, expect } from "../../fixtures/roles.fixture";
import { CockpitPage } from '../../../pages/Cockpit/cockpit.page';
import { UserTablePage } from '../../../pages/Cockpit/users/invide-user.page';
import { INVITE_TEST_DATA, USERS_TEST_DATA } from '../../data/users.testdata';

test.describe('User Table - Invite & Access Flow', () => {

  test('TC01 - Invite New User', async ({ adminPage }) => {
    const user = new UserTablePage(adminPage);
    const cockpit = new CockpitPage(adminPage);

    await cockpit.navigateToCockpitMenu(USERS_TEST_DATA.menuName);  
    await user.clickInviteUser();
    await user.fillEmail(INVITE_TEST_DATA.inviteUser.email);
    await user.selectRole(INVITE_TEST_DATA.inviteUser.role);
    await user.sendInvitation();
    await user.clickCancel();

    await user.goToInvites();
    await user.verifyUserVisible(INVITE_TEST_DATA.inviteUser.email);
  });

  test('TC02 - Accept User Invitation', async ({ adminPage }) => {
    const cockpit = new CockpitPage(adminPage);

    await cockpit.navigateToCockpitMenu(USERS_TEST_DATA.menuName); 
    const user = new UserTablePage(adminPage);

    await user.goToInvites();
    await user.acceptInvite(INVITE_TEST_DATA.inviteUser.email);

    await expect(
      adminPage.getByText(INVITE_TEST_DATA.inviteUser.email)
    ).toBeVisible();
  });

  test('TC03 - Reject User Invitation', async ({ page }) => {
    const userPage = new UserTablePage(page);

    await userPage.goToInvites();

    const rowName =
      `L ${INVITE_TEST_DATA.inviteUser.email} Zentience Innovation Labs's Account 20/02/2026 PENDING`;

    await userPage.rejectInvite(rowName);
  });

});



