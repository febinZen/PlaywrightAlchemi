import { test, expect } from "../../fixtures/roles.fixture";
import { GuardrailsPage } from "../../../pages/Cockpit/guardrails/guardrails-testplayground.page";
import { guardrailsTestData } from "../../data/guardrails.testdata";
import { CockpitPage } from "../../../pages/Cockpit/cockpit.page";

test.describe("Guardrails Test Playground", () => {
  test.beforeEach(async ({ adminPage }) => {
    const cockpit = new CockpitPage(adminPage);
    await cockpit.navigateToCockpitMenu(guardrailsTestData.menuName);
    const guardrails = new GuardrailsPage(adminPage);
    await guardrails.openTestPlayground();
  });

  test("TC01 - PII Sample with PII Detection", async ({ adminPage }) => {
    const guardrails = new GuardrailsPage(adminPage);
    const data = guardrailsTestData;

    await guardrails.selectSample(data.samples.pii);

    // disable the checkboxes of toxic and jailbreak

    await guardrails.toggleGuardrails(data.checkboxes.pii, data.allCheckboxes);

    await guardrails.runTest();

    await guardrails.validateResult(
      data.checkboxes.pii,
      data.expectedResults.piiSample.pii,
    );
  });

  test("TC02 - PII Sample with Toxic Detection", async ({ adminPage }) => {
    const guardrails = new GuardrailsPage(adminPage);
    const data = guardrailsTestData;

    await guardrails.selectSample(data.samples.pii);

    await guardrails.toggleGuardrails(data.checkboxes.toxic, data.allCheckboxes);

    await guardrails.runTest();

    await guardrails.validateResult(
      data.checkboxes.toxic,
      data.expectedResults.piiSample.toxic,
    );
  });

  test("TC03 - PII Sample with Jailbreak Detection", async ({ adminPage }) => {
    const guardrails = new GuardrailsPage(adminPage);
    const data = guardrailsTestData;

    await guardrails.selectSample(data.samples.pii);

    await guardrails.toggleGuardrails(data.checkboxes.jailbreak, data.allCheckboxes);

    await guardrails.runTest();

    await guardrails.validateResult(
      data.checkboxes.jailbreak,
      data.expectedResults.piiSample.jailbreak,
    );
  });

  test("TC04 - Toxic Sample with PII Dectection", async ({ adminPage }) => {
    const guardrails = new GuardrailsPage(adminPage);
    const data = guardrailsTestData;

    await guardrails.selectSample(data.samples.toxic);

    await guardrails.toggleGuardrails(data.checkboxes.pii, data.allCheckboxes);

    await guardrails.runTest();

    await guardrails.validateResult(
      data.checkboxes.pii,
      data.expectedResults.toxicSample.pii,
    );
  });

  test("TC05 - Toxic Sample with Toxic Detection", async ({ adminPage }) => {
    const guardrails = new GuardrailsPage(adminPage);
    const data = guardrailsTestData;

    await guardrails.selectSample(data.samples.toxic);

    await guardrails.toggleGuardrails(data.checkboxes.toxic, data.allCheckboxes);

    await guardrails.runTest();

    await guardrails.validateResult(
      data.checkboxes.toxic,
      data.expectedResults.toxicSample.toxic,
    );
  });

  test("TC06 - Toxic Sample with Jailbreak Detection", async ({
    adminPage,
  }) => {
    const guardrails = new GuardrailsPage(adminPage);
    const data = guardrailsTestData;

    await guardrails.selectSample(data.samples.toxic);

    await guardrails.toggleGuardrails(data.checkboxes.jailbreak, data.allCheckboxes);

    await guardrails.runTest();

    await guardrails.validateResult(
      data.checkboxes.jailbreak,
      data.expectedResults.toxicSample.jailbreak,
    );
  });

  test("TC07 - PII Sample with All Guardrails", async ({ adminPage }) => {
    const guardrails = new GuardrailsPage(adminPage);
    const data = guardrailsTestData;

    await guardrails.selectSample(data.samples.pii);

    await guardrails.runTest();

    await guardrails.validateResult(data.checkboxes.pii, "Failed");
    await guardrails.validateResult(data.checkboxes.toxic, "Passed");
    await guardrails.validateResult(data.checkboxes.jailbreak, "Passed");
  });

  test("TC08 - Toxic Sample with All Guardrails", async ({ adminPage }) => {
    const guardrails = new GuardrailsPage(adminPage);
    const data = guardrailsTestData;

    await guardrails.selectSample(data.samples.toxic);

    await guardrails.runTest();

    await guardrails.validateResult(data.checkboxes.pii, "Passed");
    await guardrails.validateResult(data.checkboxes.toxic, "Failed");
    await guardrails.validateResult(data.checkboxes.jailbreak, "Passed");
  });

  test("TC09 - Jailbreak Sample with All Guardrails", async ({ adminPage }) => {
    const guardrails = new GuardrailsPage(adminPage);
    const data = guardrailsTestData;

    await guardrails.selectSample(data.samples.jailbreak);

    
    await guardrails.runTest();

    await guardrails.validateResult(data.checkboxes.pii, "Passed");
    await guardrails.validateResult(data.checkboxes.toxic, "Passed");
    await guardrails.validateResult(data.checkboxes.jailbreak, "Failed");
  });

  test("TC10 - Clean Sample validation", async ({ adminPage }) => {
    const guardrails = new GuardrailsPage(adminPage);
    const data = guardrailsTestData;

    await guardrails.selectSample(data.samples.clean);

    await guardrails.runTest();

    await guardrails.validateOverall(data.expectedResults.cleanSample.overall);
  });
});
