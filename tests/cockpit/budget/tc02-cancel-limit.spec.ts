import { test, expect } from "../../fixtures/roles.fixture";
import { BudgetPage } from "../../../pages/budget/budget.page";
import { budgetTestData } from "../../data/budget.testdata";

test("TC02 - Cancel Should Not Update Value", async ({ adminPage }) => {
  const budget = new BudgetPage(adminPage);
  await budget.navigate();

  const group = budgetTestData.groups.devSecOps;

  const row = budget.groupRow(group);
  const originalText = await row.textContent();

  await budget.clickEditForRow(group);
  await budget.spendingInput().fill("5000");
  await budget.clickCancel();

  await expect(row).toHaveText(originalText || "");
});
