import { test, expect } from "@playwright/test";

test.describe("Download Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/download");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Download.*Excel|Excel.*Calculator/i);
  });

  test("shows hero heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Download the WageLab Excel Calculator/ })
    ).toBeVisible();
  });

  test("shows one-time purchase label", async ({ page }) => {
    await expect(page.getByText(/One-time purchase/).first()).toBeVisible();
  });

  test("shows £9.99 price", async ({ page }) => {
    await expect(page.getByText("£9.99", { exact: true })).toBeVisible();
  });

  test("shows What's included section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "What's included" })).toBeVisible();
  });

  test("shows feature checklist items", async ({ page }) => {
    await expect(page.getByText(/same calculation logic as the free online version/)).toBeVisible();
    await expect(page.getByText(/offline/i).first()).toBeVisible();
    await expect(page.getByText(/Tax Bands & Rates/).first()).toBeVisible();
  });

  test("shows checkout buy link", async ({ page }) => {
    const btn = page.getByRole("link", { name: /Buy now — £9.99/ });
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute("href", "https://buy.stripe.com/6oU14n6xseSqapCfp15kk00");
  });

  test("shows Stripe security note", async ({ page }) => {
    await expect(page.getByText(/Secure checkout via Stripe/)).toBeVisible();
  });

  test("shows common questions section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Common questions" })).toBeVisible();
    await expect(page.getByText(/What format is the file/)).toBeVisible();
    await expect(page.getByText(/Is this a one-time purchase/)).toBeVisible();
  });

  test("shows link to free online calculator", async ({ page }) => {
    const link = page.getByRole("link", { name: /Use the free online calculator/ });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/calculator");
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
