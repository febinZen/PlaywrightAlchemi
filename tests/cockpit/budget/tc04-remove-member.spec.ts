import { test, expect } from "../../fixtures/roles.fixture";
import { BudgetPage } from "../../../pages/budget/budget.page";
import { budgetTestData } from "../../data/budget.testdata";

test("TC04 - Remove Member Validation", async ({ adminPage }) => {
  const budget = new BudgetPage(adminPage);
  await budget.navigate();

  const member = budgetTestData.members.lisa;

  await budget.clickEditForRow(member);
  await budget.clickRemove();
  await budget.confirmIfVisible();

  await expect(budget.memberRow(member)).toHaveCount(0);
});
