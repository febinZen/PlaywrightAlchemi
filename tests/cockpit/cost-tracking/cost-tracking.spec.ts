import { test, expect } from '@playwright/test';
import { CostTrackingPage } from '../../../pages/cost-tracking/cost-tracking.page';
import { costTrackingTestData } from '../../testdata/cost-tracking.testdata';

test.describe('Cost Tracking Module', () => {

  test.beforeEach(async ({ page }) => {
    const cost = new CostTrackingPage(page);
    await cost.navigate();
  });

  test('Toggle Metrics', async ({ page }) => {

    const cost = new CostTrackingPage(page);

    for (const metric of costTrackingTestData.metrics) {
      await cost.metricButton(metric).click();
      await expect(cost.metricButton(metric)).toBeVisible();
    }
  });

  test('Search Table', async ({ page }) => {

    const cost = new CostTrackingPage(page);

    await cost.searchBox().fill(costTrackingTestData.search.valid);
    await expect(cost.searchBox())
      .toHaveValue(costTrackingTestData.search.valid);

    await cost.clearSearch().click();
    await expect(cost.searchBox()).toHaveValue('');
  });

});
