import { test, expect } from "@playwright/test";

test.describe("Calculator Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/calculator");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/UK Take-Home Pay Calculator/);
    await expect(page).toHaveTitle(/WageLab/);
  });

  test("calculator renders the main UI", async ({ page }) => {
    // The calculator header shows version info
    await expect(page.getByText(/2026\/27/).first()).toBeVisible();
    // Main container is visible
    await expect(page.locator('div').filter({ hasText: /Annual Take-Home/i }).first()).toBeVisible();
  });

  test("shows Annual Take-Home section with a figure", async ({ page }) => {
    await expect(page.getByText("Annual Take-Home").first()).toBeVisible();
    // Should show a currency value in the hero card
    const heroCard = page.locator('div').filter({ hasText: /^Annual Take-Home/ }).first();
    await expect(heroCard).toBeVisible();
  });

  test("salary input is present and functional", async ({ page }) => {
    await expect(page.getByText("Employment Salary")).toBeVisible();
    // The salary input is the first text input
    const inputs = page.locator('input[type="text"]');
    expect(await inputs.count()).toBeGreaterThan(0);
  });

  test("pension contribution slider is present", async ({ page }) => {
    await expect(page.getByText("Pension Contribution").first()).toBeVisible();
    const slider = page.locator('input[type="range"]');
    await expect(slider).toBeVisible();
  });

  test("region buttons work (England/Scotland toggle)", async ({ page }) => {
    const englandBtn = page.getByRole("button", {
      name: /England \/ Wales \/ N\.Ireland/,
    });
    const scotlandBtn = page.getByRole("button", { name: "Scotland" });
    await expect(englandBtn).toBeVisible();
    await expect(scotlandBtn).toBeVisible();
    await scotlandBtn.click();
    await expect(page.getByText("Annual Take-Home").first()).toBeVisible();
  });

  test("result tabs are present", async ({ page }) => {
    await expect(page.getByRole("button", { name: "summary" })).toBeVisible();
    await expect(page.getByRole("button", { name: "breakdown" })).toBeVisible();
    await expect(page.getByRole("button", { name: "allowances" })).toBeVisible();
    await expect(page.getByRole("button", { name: "employer" })).toBeVisible();
    await expect(page.getByRole("button", { name: "payslip" })).toBeVisible();
  });

  test("clicking breakdown tab shows income & deductions", async ({ page }) => {
    await page.getByRole("button", { name: "breakdown" }).click();
    await expect(page.getByText("Income & Deductions")).toBeVisible();
    await expect(page.getByText("Income Tax Breakdown")).toBeVisible();
  });

  test("clicking allowances tab shows PA section", async ({ page }) => {
    await page.getByRole("button", { name: "allowances" }).click();
    // The allowances panel header
    await expect(page.getByText("Personal Allowance").first()).toBeVisible();
    await expect(page.getByText("Savings & Dividends")).toBeVisible();
  });

  test("clicking employer tab shows Employer NI info", async ({ page }) => {
    await page.getByRole("button", { name: "employer" }).click();
    await expect(page.getByText("Employer NI (informational)")).toBeVisible();
    await expect(page.getByText("Total Employment Cost")).toBeVisible();
  });

  test("clicking payslip tab shows payslip view", async ({ page }) => {
    await page.getByRole("button", { name: "payslip" }).click();
    await expect(
      page.getByText("ILLUSTRATIVE PAYSLIP — NOT AN OFFICIAL DOCUMENT")
    ).toBeVisible();
    await expect(page.getByText("NET PAY", { exact: true })).toBeVisible();
  });

  test("student loan selector is present", async ({ page }) => {
    await expect(page.getByText("Student Loan Plan")).toBeVisible();
    const selects = page.locator("select");
    expect(await selects.count()).toBeGreaterThan(0);
  });

  test("national insurance toggle is present", async ({ page }) => {
    await expect(page.getByText("Pay National Insurance?")).toBeVisible();
  });

  test("changing salary updates take-home figure", async ({ page }) => {
    // Get initial net value from the hero card
    const heroFigure = page.locator('[style*="color:#22c55e"]').first();
    const initialValue = await heroFigure.textContent();

    const salaryInput = page.locator('input[type="text"]').first();
    await salaryInput.click();
    await salaryInput.fill("80000");
    await salaryInput.press("Tab");
    await page.waitForTimeout(600);

    const updatedValue = await heroFigure.textContent();
    expect(updatedValue).not.toBe(initialValue);
  });

  test("page has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });
});
