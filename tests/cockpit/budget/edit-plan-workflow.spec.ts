// import { test, expect } from "@playwright/test";
import { test, expect } from "../../fixtures/roles.fixture";

import { BudgetPage } from "../../../pages/budget/budget.page";
import { EditPlanPage } from "../../../pages/budget/edit-plan.page";
import { editPlanTestData } from "../../data/budget.testdata";

test.describe("Edit Plan Workflow", () => {
  test.beforeEach(async ({ adminPage }) => {
    const budget = new BudgetPage(adminPage);
    await budget.navigate();
  });

  test("Update Plan Name", async ({ adminPage }) => {
    const edit = new EditPlanPage(adminPage);

    await edit.open();

    const planName = editPlanTestData.planNames.valid[0];
    await edit.planNameInput().fill(planName);

    await edit.continueButton().click();
    await edit.backButton().click();

    await expect(edit.planNameInput()).toHaveValue(planName);
  });

  test("Credits Arrow", async ({ adminPage }) => {
    const edit = new EditPlanPage(adminPage);

    await edit.open();
    await edit.continueButton().click();

    await edit.creditsInput().press("ArrowUp");
    await edit.creditsInput().press("ArrowDown");

    await expect(edit.creditsInput()).toBeVisible();
  });
});
