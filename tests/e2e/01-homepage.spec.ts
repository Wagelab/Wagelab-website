import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/WageLab/);
    await expect(page).toHaveTitle(/UK Take-Home Pay Calculator/);
  });

  test("header renders with logo and nav links", async ({ page }) => {
    const header = page.locator("header");
    await expect(header).toBeVisible();
    // Logo text
    await expect(header.locator("text=wagelab").first()).toBeVisible();
    // Nav links
    await expect(page.getByRole("link", { name: "Calculator" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Articles" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Download" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "About" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "FAQ" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact" }).first()).toBeVisible();
  });

  test("header has Download CTA button", async ({ page }) => {
    const downloadBtn = page.getByRole("link", { name: /Download — £9\.99/ }).first();
    await expect(downloadBtn).toBeVisible();
    await expect(downloadBtn).toHaveAttribute("href", "/download");
  });

  test("hero section has correct headline", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Your UK take-home pay"
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "calculated properly"
    );
  });

  test("hero has calculate CTA button linking to calculator", async ({ page }) => {
    const cta = page.getByRole("link", { name: /Calculate my take-home pay/ });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/calculator");
  });

  test("hero has example result card", async ({ page }) => {
    await expect(page.getByText("£42,107")).toBeVisible();
    await expect(page.getByText(/£3,509 per month/)).toBeVisible();
  });

  test("features strip displays key features", async ({ page }) => {
    const strip = page.locator("section").filter({ hasText: "✓  Salary sacrifice" });
    await expect(strip).toBeVisible();
    await expect(strip).toContainText("Scottish bands");
    await expect(strip).toContainText("Mock payslip");
  });

  test("download CTA strip is present", async ({ page }) => {
    await expect(page.getByText("Excel Calculator — Download")).toBeVisible();
    const downloadLink = page.getByRole("link", { name: /Download — £9\.99/ }).last();
    await expect(downloadLink).toHaveAttribute("href", "/download");
  });

  test("footer renders with FCA disclaimer", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("not regulated by the Financial Conduct Authority");
    await expect(footer).toContainText("WageLab");
  });

  test("footer has all navigation links", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "Privacy Policy" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Cookie Policy" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Terms of Use" })).toBeVisible();
  });

  test("footer shows current year copyright", async ({ page }) => {
    const year = new Date().getFullYear().toString();
    await expect(page.locator("footer")).toContainText(`© WageLab ${year}`);
  });

  test("cookie banner appears on first visit", async ({ page }) => {
    // Clear localStorage to simulate first visit
    await page.evaluate(() => localStorage.removeItem("wagelab-cookie-consent"));
    await page.reload();
    const banner = page.getByRole("dialog", { name: /cookie/i });
    await expect(banner).toBeVisible();
    await expect(banner.getByRole("button", { name: "Accept" })).toBeVisible();
    await expect(banner.getByRole("button", { name: "Decline" })).toBeVisible();
  });

  test("cookie banner disappears after accepting", async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem("wagelab-cookie-consent"));
    await page.reload();
    await page.getByRole("button", { name: "Accept" }).click();
    await expect(page.getByRole("dialog", { name: /cookie/i })).toBeHidden();
  });

  test("hero CTA navigates to calculator", async ({ page }) => {
    await page.getByRole("link", { name: /Calculate my take-home pay/ }).click();
    await expect(page).toHaveURL("/calculator");
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
