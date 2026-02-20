import { test, expect } from '../../fixtures/roles.fixture';
import { AccessPolicyPage } from '../../../pages/Cockpit/access-policy/access-policy.page';
import { CopilotModelPage } from '../../../pages/copilot/copilot-model.page';
import { ACCESS_POLICY_DATA } from '../../data/access.policy.testcases';

test('Admin disables AI models →  User cannot see them',
async ({ adminPage, userPage }) => {

  const accessPolicy = new AccessPolicyPage(adminPage);
  const adminCopilot = new CopilotModelPage(adminPage);
  const userCopilot = new CopilotModelPage(userPage);

  // ==========================================
  // 🔐 ADMIN DISABLES MODELS
  // ==========================================
  await accessPolicy.navigate();

  await accessPolicy.openAiModelsSection(
    ACCESS_POLICY_DATA.policySection
  );

  for (const model of ACCESS_POLICY_DATA.modelsToDisable) {
    await accessPolicy.toggleModel(model);
  }

  await accessPolicy.closeModal();

  // ==========================================
  // 👤 USER VALIDATION
  // ==========================================
 

  await userCopilot.openModelDropdown(
    ACCESS_POLICY_DATA.visibleModel
  );

  for (const model of ACCESS_POLICY_DATA.modelsToDisable) {
    await expect(
      userCopilot.modelOption(model)
    ).toHaveCount(0);
  }
});
