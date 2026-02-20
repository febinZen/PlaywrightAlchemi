import { test, expect } from "../../fixtures/roles.fixture";
import { BudgetPage } from "../../../pages/Cockpit/budget/budget.page";
import { budgetTestData } from "../../data/budget.testdata";
import { CockpitPage } from "../../../pages/Cockpit/cockpit.page";

test("TC05 - Invalid Spending Limit Validation", async ({ adminPage }) => {
  const budget = new BudgetPage(adminPage);
  const cockpit = new CockpitPage(adminPage);

  await cockpit.navigateToCockpitMenu(budgetTestData.menuName);

  const group = budgetTestData.groups.devSecOps;

  await budget.clickEditForRow(group);

  const input = budget.spendingInput();
  await input.fill(budgetTestData.spendingLimits.invalid.negative.toString());

  await budget.clickUpdate();

  const validationMessage = await input.evaluate(
    (el: HTMLInputElement) => el.validationMessage,
  );

  expect(validationMessage.length).toBeGreaterThan(0);
});
