import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/About WageLab/);
  });

  test("shows hero header with page heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "About WageLab" })).toBeVisible();
    await expect(page.getByText("Built for people who want to understand their payslip properly.").first()).toBeVisible();
  });

  test("shows What is WageLab section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "What is WageLab?" })).toBeVisible();
    await expect(page.getByText(/free UK take-home pay calculator/)).toBeVisible();
  });

  test("shows feature checklist", async ({ page }) => {
    await expect(page.getByText("What makes it different?")).toBeVisible();
    await expect(page.getByText(/three pension methods/i)).toBeVisible();
    await expect(page.getByText(/Scottish Income Tax bands/i)).toBeVisible();
    await expect(page.getByText(/mock payslip/i)).toBeVisible();
  });

  test("shows FCA disclaimer box", async ({ page }) => {
    await expect(page.getByText("Is this financial advice?")).toBeVisible();
    await expect(page.getByText(/not FCA regulated/)).toBeVisible();
  });

  test("shows data privacy section", async ({ page }) => {
    await expect(page.getByText("Is my data stored?").first()).toBeVisible();
    await expect(page.getByText(/Zero data collected/)).toBeVisible();
  });

  test("shows accuracy stats panel", async ({ page }) => {
    await expect(page.getByText("Calculator accuracy")).toBeVisible();
    await expect(page.getByText("36/36")).toBeVisible();
    await expect(page.getByText("Test cases passing")).toBeVisible();
  });

  test("shows contact section with email", async ({ page }) => {
    await expect(page.getByRole("link", { name: "hello@wagelab.co.uk" })).toBeVisible();
  });

  test("has CTA to calculator", async ({ page }) => {
    const cta = page.getByRole("link", { name: /Try the free calculator/ });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/calculator");
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
