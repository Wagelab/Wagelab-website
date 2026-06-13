import { test, expect } from "@playwright/test";

test.describe("Privacy Policy Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/privacy-policy");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Privacy Policy/);
  });

  test("shows hero heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Privacy Policy", level: 1 })).toBeVisible();
  });

  test("shows last updated date", async ({ page }) => {
    await expect(page.getByText(/June 2026/)).toBeVisible();
  });

  test("shows Who we are section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /1\. Who we are/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "hello@wagelab.co.uk" }).first()).toBeVisible();
  });

  test("shows What data we collect section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /2\. What data we collect/ })).toBeVisible();
    await expect(page.getByText(/entirely within your browser/)).toBeVisible();
  });

  test("shows Your rights section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /6\. Your rights/ })).toBeVisible();
    await expect(page.getByText(/right to access/)).toBeVisible();
  });

  test("shows ICO complaint link", async ({ page }) => {
    await expect(page.getByRole("link", { name: "ico.org.uk" })).toBeVisible();
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

test.describe("Cookie Policy Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cookie-policy");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Cookie Policy/);
  });

  test("shows hero heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Cookie Policy", level: 1 })).toBeVisible();
  });

  test("shows what are cookies section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "What are cookies?" })).toBeVisible();
  });

  test("shows cookies table", async ({ page }) => {
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Cookie" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Provider" })).toBeVisible();
  });

  test("shows wagelab_consent cookie in table", async ({ page }) => {
    await expect(page.getByRole("cell", { name: "wagelab_consent" })).toBeVisible();
  });

  test("shows managing cookies section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Managing cookies" })).toBeVisible();
  });

  test("shows essential cookies section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Essential cookies" })).toBeVisible();
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

test.describe("Terms of Use Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/terms-of-use");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Terms of Use/);
  });

  test("shows hero heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Terms of Use", level: 1 })).toBeVisible();
  });

  test("shows last updated text", async ({ page }) => {
    await expect(page.getByText(/June 2026/)).toBeVisible();
  });

  test("shows acceptance of terms section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /1\. Acceptance of terms/ })).toBeVisible();
  });

  test("shows no financial advice section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /4\. No financial advice/ })).toBeVisible();
    await expect(page.getByText(/not authorised or regulated by the Financial Conduct Authority/)).toBeVisible();
  });

  test("shows affiliate links section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /5\. Affiliate links/ })).toBeVisible();
    await expect(page.getByText(/capital is at risk/)).toBeVisible();
  });

  test("shows governing law section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /9\. Governing law/ })).toBeVisible();
    await expect(page.getByText(/England and Wales/)).toBeVisible();
  });

  test("shows contact email", async ({ page }) => {
    await expect(page.getByRole("link", { name: "hello@wagelab.co.uk" })).toBeVisible();
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
