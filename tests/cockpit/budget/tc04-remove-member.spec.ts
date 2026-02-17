import { test, expect } from '@playwright/test';
import { BudgetPage } from '../../../pages/budget/budget.page';
import { budgetTestData } from '../../data/budget.testdata';

test('TC04 - Remove Member Validation', async ({ page }) => {

  const budget = new BudgetPage(page);
  await budget.navigate();

  const member = budgetTestData.members.lisa;

  await budget.clickEditForRow(member);
  await budget.clickRemove();
  await budget.confirmIfVisible();

  await expect(budget.memberRow(member)).toHaveCount(0);
});
