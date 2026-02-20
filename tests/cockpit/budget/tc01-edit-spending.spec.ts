// import { test, expect } from '@playwright/test';
import { test, expect } from "../../fixtures/roles.fixture";
import { CockpitPage } from "../../../pages/Cockpit/cockpit.page";
import { BudgetPage } from "../../../pages/Cockpit/budget/budget.page";
import { budgetTestData } from "../../data/budget.testdata";

test("TC01 - Edit Spending Limit", async ({ adminPage }) => {
  const cockpit = new CockpitPage(adminPage);
  const budget = new BudgetPage(adminPage);

  await cockpit.navigateToCockpitMenu(budgetTestData.menuName);
  
  const group = budgetTestData.groups.devSecOps;
  const value = budgetTestData.spendingLimits.valid.medium;

  await budget.clickEditForRow(group);
  await budget.spendingInput().fill(value.toString());
  await budget.clickUpdate();

  await expect(budget.groupRow(group)).toContainText(value.toLocaleString());
});
