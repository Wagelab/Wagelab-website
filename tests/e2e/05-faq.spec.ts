import { test, expect } from "@playwright/test";

test.describe("FAQ Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/faq");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Frequently Asked Questions/);
  });

  test("shows hero heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Frequently Asked Questions" })
    ).toBeVisible();
  });

  test("shows all 6 section headings", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "About the calculator" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Income Tax" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pensions" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Student Loans" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The Excel download" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "General" })).toBeVisible();
  });

  test("accordion items are collapsed by default", async ({ page }) => {
    // The first FAQ answer should not be visible initially
    await expect(
      page.getByText("WageLab uses HMRC's published rates")
    ).not.toBeVisible();
  });

  test("accordion expands on click", async ({ page }) => {
    const firstQuestion = page.getByRole("button", {
      name: /How accurate is the WageLab calculator/,
    });
    await expect(firstQuestion).toBeVisible();
    await firstQuestion.click();
    await expect(
      page.getByText("WageLab uses HMRC's published rates")
    ).toBeVisible();
  });

  test("accordion collapses on second click", async ({ page }) => {
    const firstQuestion = page.getByRole("button", {
      name: /How accurate is the WageLab calculator/,
    });
    await firstQuestion.click();
    await expect(
      page.getByText("WageLab uses HMRC's published rates")
    ).toBeVisible();
    await firstQuestion.click();
    await expect(
      page.getByText("WageLab uses HMRC's published rates")
    ).not.toBeVisible();
  });

  test("multiple accordions can be open simultaneously", async ({ page }) => {
    const q1 = page.getByRole("button", { name: /How accurate is the WageLab calculator/ });
    const q2 = page.getByRole("button", { name: /Is the calculator free/ });
    await q1.click();
    await q2.click();
    await expect(page.getByText("WageLab uses HMRC's published rates")).toBeVisible();
    await expect(page.getByText("Yes. The online calculator at wagelab.co.uk")).toBeVisible();
  });

  test("shows pension section question about salary sacrifice", async ({ page }) => {
    const btn = page.getByRole("button", {
      name: /What is the difference between salary sacrifice and relief at source/,
    });
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page.getByText(/Salary sacrifice reduces your contractual gross salary/)).toBeVisible();
  });

  test("shows contact email link in CTA", async ({ page }) => {
    const emailLink = page.getByRole("link", { name: "hello@wagelab.co.uk" });
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute("href", "mailto:hello@wagelab.co.uk");
  });

  test("shows link to calculator in CTA", async ({ page }) => {
    const calcLink = page.getByRole("link", { name: "try the calculator" });
    await expect(calcLink).toBeVisible();
    await expect(calcLink).toHaveAttribute("href", "/calculator");
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
