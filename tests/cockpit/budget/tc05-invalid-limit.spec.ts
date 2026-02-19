import { test, expect } from "../../fixtures/roles.fixture";
import { BudgetPage } from "../../../pages/budget/budget.page";
import { budgetTestData } from "../../data/budget.testdata";

test("TC05 - Invalid Spending Limit Validation", async ({ adminPage }) => {
  const budget = new BudgetPage(adminPage);
  await budget.navigate();

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
