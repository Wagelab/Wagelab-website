import { test, expect } from "@playwright/test";

test.describe("Providers Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/providers");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Pension.*Investment Providers|Providers/i);
  });

  test("shows hero heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Pension & Investment Providers" })
    ).toBeVisible();
  });

  test("shows affiliate disclosure banner", async ({ page }) => {
    await expect(page.getByText(/Affiliate disclosure/)).toBeVisible();
    await expect(page.getByText(/does not affect the price you pay/).first()).toBeVisible();
  });

  test("shows Opening an account section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Opening an account with an affiliate" })).toBeVisible();
  });

  test("shows SIPPs section heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /SIPPs — Self-Invested Personal Pensions/ })
    ).toBeVisible();
  });

  test("shows SIPP provider cards", async ({ page }) => {
    await expect(page.getByText("Hargreaves Lansdown").first()).toBeVisible();
    await expect(page.getByText("PensionBee")).toBeVisible();
    await expect(page.getByText("AJ Bell")).toBeVisible();
  });

  test("shows Stocks & Shares ISAs section heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Stocks.*Shares ISAs/ })
    ).toBeVisible();
  });

  test("shows ISA description with allowance amount", async ({ page }) => {
    await expect(page.getByText(/£20,000/)).toBeVisible();
  });

  test("shows FCA disclaimer", async ({ page }) => {
    await expect(page.getByText("Not financial advice.")).toBeVisible();
    await expect(page.getByText(/not FCA regulated/)).toBeVisible();
  });

  test("shows CTA to calculator", async ({ page }) => {
    const link = page.getByRole("link", { name: /Model your pension contributions/ });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/calculator");
  });

  test("provider links open with nofollow", async ({ page }) => {
    const providerLinks = page.locator('a[rel*="nofollow"]');
    const count = await providerLinks.count();
    expect(count).toBeGreaterThanOrEqual(5);
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
