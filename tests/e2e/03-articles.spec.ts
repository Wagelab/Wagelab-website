import { test, expect } from "@playwright/test";

test.describe("Articles List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/articles");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/UK Tax.*Articles|Articles.*WageLab/);
  });

  test("shows the articles heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Articles" })).toBeVisible();
  });

  test("shows article cards", async ({ page }) => {
    const cards = page.locator("a[href^='/articles/']");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("article cards have titles and descriptions", async ({ page }) => {
    // Check first article
    const firstCard = page.locator("a[href^='/articles/']").first();
    await expect(firstCard).toBeVisible();
    // Should have h2 heading inside
    await expect(firstCard.locator("h2")).toBeVisible();
  });

  test("article cards have category labels", async ({ page }) => {
    // At least one card should have a category
    await expect(page.getByText(/Income Tax|Pensions|Student Loans|Salary Sacrifice|National Insurance/).first()).toBeVisible();
  });

  test("article cards have read time", async ({ page }) => {
    await expect(page.getByText(/\d+ min read/).first()).toBeVisible();
  });

  test("article cards are clickable links", async ({ page }) => {
    const firstCard = page.locator("a[href^='/articles/']").first();
    const href = await firstCard.getAttribute("href");
    expect(href).toMatch(/^\/articles\/.+/);
  });

  test("100k income trap article is present", async ({ page }) => {
    await expect(page.getByText(/£100,000|100k|income trap/i)).toBeVisible();
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

test.describe("Article Detail Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/articles/the-100k-income-trap");
  });

  test("has correct page title containing article name", async ({ page }) => {
    await expect(page).toHaveTitle(/£100,000|100k|Income Trap/i);
  });

  test("shows article title as h1", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/£100,000|income trap/i);
  });

  test("shows article category", async ({ page }) => {
    await expect(page.getByText("Income Tax").first()).toBeVisible();
  });

  test("shows read time", async ({ page }) => {
    await expect(page.getByText(/\d+ min read/)).toBeVisible();
  });

  test("shows article body content", async ({ page }) => {
    await expect(page.locator("article")).toBeVisible();
    // Article should have h2 headings
    await expect(page.locator("article h2").first()).toBeVisible();
  });

  test("shows CTA to calculator at end of article", async ({ page }) => {
    await expect(page.getByText("Calculate your take-home pay")).toBeVisible();
    await expect(page.getByRole("link", { name: /Try the calculator/ })).toBeVisible();
  });

  test("has breadcrumb navigation", async ({ page }) => {
    const breadcrumb = page.locator("nav").filter({ hasText: "Home" }).first();
    await expect(breadcrumb.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(breadcrumb.getByRole("link", { name: "Articles" })).toBeVisible();
  });

  test("has back to articles link", async ({ page }) => {
    await expect(page.getByRole("link", { name: /← All articles/ })).toBeVisible();
  });

  test("404 for non-existent article slug", async ({ page }) => {
    const response = await page.goto("/articles/this-article-does-not-exist-xyz");
    // HTTP 404 status
    expect(response?.status()).toBe(404);
    // Page shows 404 content
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByText("Page not found")).toBeVisible();
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
