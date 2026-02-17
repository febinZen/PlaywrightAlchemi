import { test, expect } from '@playwright/test';
import { BudgetPage } from '../../../pages/budget/budget.page';
import { budgetTestData } from '../../data/budget.testdata';

test('TC01 - Edit Spending Limit', async ({ page }) => {
  const budget = new BudgetPage(page);

  await budget.navigate();

  const group = budgetTestData.groups.devSecOps;
  const value = budgetTestData.spendingLimits.valid.medium;

  await budget.clickEditForRow(group);
  await budget.spendingInput().fill(value.toString());
  await budget.clickUpdate();

  await expect(budget.groupRow(group))
    .toContainText(value.toLocaleString());
});
