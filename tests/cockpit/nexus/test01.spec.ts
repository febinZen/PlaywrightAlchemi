import { test, expect } from "@playwright/test";

test("click second svg in card and rename workspace", async ({ page }) => {
  // Open local dummy page (hard-coded path)
  await page.goto(
    "file:///d:/Tempfile/INTERNSHIPZEN/AlchemiPlaywright/dummy.html",
  );

  // Hard-coded card title to locate the card
  const cardTitle = "Admin User FSnew long name with";
  const newName = "Hard_Renamed_Test";

  // Locate the card's ancestor element that has the 'group rounded-2xl' class
  const card = page.locator(
    `xpath=//h3[contains(normalize-space(.), "${cardTitle}")]/ancestor::div[contains(@class, 'group')][1]`,
  );

  // Ensure the card exists
  await expect(card).toHaveCount(1);

  // Click the second <svg> inside the card. If that fails, fallback to clicking the
  // options button inside the card (aria-label="Workspace options").
  const svgs = card.locator("svg");
  const svgCount = await svgs.count();
  if (svgCount >= 2) {
    try {
      await svgs.nth(1).click();
    } catch (err) {
      // fallback
      await card.getByRole("button", { name: "Workspace options" }).click();
    }
  } else {
    await card.getByRole("button", { name: "Workspace options" }).click();
  }

  // Wait for menu and click Rename
  await page.getByRole("menuitem", { name: "Rename" }).click();

  // Fill rename dialog and confirm
  const textbox = page.getByRole("textbox", {
    name: "Enter New Workspace Name",
  });
  await textbox.click();
  await textbox.fill(newName);
  await page.getByRole("button", { name: "Rename" }).click();

  // Verify rename visible somewhere on the page
  await expect(page.getByText(newName).first()).toBeVisible();
});
