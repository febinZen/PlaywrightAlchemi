import { test, expect } from "../../fixtures/roles.fixture";
import { CostTrackingPage } from "../../../pages/Cockpit/cost-tracking/cost-tracking.page";
import { costTrackingTestData } from "../../data/cost-tracking.testdata";

test.describe("Cost Tracking Module", () => {
  test.beforeEach(async ({ adminPage }) => {
    const cost = new CostTrackingPage(adminPage);
    await cost.navigate();
  });

  test("Toggle Metrics", async ({ adminPage }) => {
    const cost = new CostTrackingPage(adminPage);

    for (const metric of costTrackingTestData.metrics) {
      await cost.metricButton(metric).click();
      await expect(cost.metricButton(metric)).toBeVisible();
    }
  });

  test("Search Table", async ({ adminPage }) => {
    const cost = new CostTrackingPage(adminPage);

    await cost.searchBox().fill(costTrackingTestData.search.valid);
    await expect(cost.searchBox()).toHaveValue(
      costTrackingTestData.search.valid,
    );

    await cost.clearSearch().click();
    await expect(cost.searchBox()).toHaveValue("");
  });
});
