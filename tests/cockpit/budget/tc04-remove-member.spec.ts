import { test, expect } from "../../fixtures/roles.fixture";
import { BudgetPage } from "../../../pages/Cockpit/budget/budget.page";
import { budgetTestData } from "../../data/budget.testdata";
import { CockpitPage } from "../../../pages/Cockpit/cockpit.page";

test("TC04 - Remove Member Validation", async ({ adminPage }) => {
  const budget = new BudgetPage(adminPage);
  const cockpit = new CockpitPage(adminPage);
  
  await cockpit.navigateToCockpitMenu(budgetTestData.menuName)

  const member = budgetTestData.members.lisa;

  await budget.clickEditForRow(member);
  await budget.clickRemove();
  await budget.confirmIfVisible();

  await expect(budget.memberRow(member)).toHaveCount(0);
});
