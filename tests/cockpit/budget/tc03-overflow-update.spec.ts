import { test, expect } from "../../fixtures/roles.fixture";
import { BudgetPage } from "../../../pages/Cockpit/budget/budget.page";
import { budgetTestData } from "../../data/budget.testdata";
import { CockpitPage } from "../../../pages/Cockpit/cockpit.page";

test("TC03 - Overflow + Spending Limit Update", async ({ adminPage }) => {
  const budget = new BudgetPage(adminPage);
  const cockpit = new CockpitPage(adminPage);
  await cockpit.navigateToCockpitMenu(budgetTestData.menuName);

  const member = budgetTestData.members.fiona;
  const newLimit = budgetTestData.spendingLimits.valid.memberUpdate;
  const newCap = budgetTestData.overflowCap.valid;

  await budget.clickEditForRow(member);

  await budget.spendingInput().fill(newLimit.toString());

  await budget.overflowDropdown().click();
  await adminPage
    .getByRole("option", {
      name: budgetTestData.overflowTypes.capped,
    })
    .click();

  await budget.overflowCapInput().fill(newCap.toString());

  await budget.clickUpdate();

  await expect(budget.memberRow(member)).toContainText(
    newLimit.toLocaleString(),
  );

  await expect(budget.memberRow(member)).toContainText(newCap.toString());
});
