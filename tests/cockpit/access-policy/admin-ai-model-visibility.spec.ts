import { test, expect } from '../../fixtures/roles.fixture';
import { AccessPolicyPage } from '../../../pages/Cockpit/access-policy/access-policy.page';
import { CopilotModelPage } from '../../../pages/copilot/copilot-model.page';
import { ACCESS_POLICY_DATA } from '../../data/access.policy.testcases';
import { CockpitPage } from '../../../pages/Cockpit/cockpit.page';

test('Admin disables AI models → Admin cannot see them',
async ({ adminPage, userPage }) => {

  const accessPolicy = new AccessPolicyPage(adminPage);
  const adminCopilot = new CopilotModelPage(adminPage);
  const userCopilot = new CopilotModelPage(userPage);
  const cockpitPage = new CockpitPage(adminPage);
  


  // ==========================================
  // 🔐 ADMIN DISABLES MODELS
  // ==========================================
  await cockpitPage.navigateToCockpitMenu(ACCESS_POLICY_DATA.menuName);

  await accessPolicy.openAiModelsSection(
    ACCESS_POLICY_DATA.policySection
  );

  for (const model of ACCESS_POLICY_DATA.modelsToDisable) {
    await accessPolicy.toggleModel(model);
  }

  await accessPolicy.closeModal();

  await cockpitPage.navigateToHome();

  // ==========================================
  // 🔎 ADMIN VALIDATION
  // ==========================================
  await adminCopilot.navigateToSpace('Open Testing New');

  await adminCopilot.openModelDropdown(
    ACCESS_POLICY_DATA.visibleModel
  );

  for (const model of ACCESS_POLICY_DATA.modelsToDisable) {
    await expect(
      adminCopilot.modelOption(model)
    ).toHaveCount(0);
  }

});