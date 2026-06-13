import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Contact/);
  });

  test("shows hero heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Contact", level: 1 })).toBeVisible();
  });

  test("shows response time in hero subtext", async ({ page }) => {
    await expect(page.getByText(/2–3 working days/).first()).toBeVisible();
  });

  test("shows Get in touch section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Get in touch" })).toBeVisible();
    await expect(page.getByText(/general enquiries about the WageLab calculator/)).toBeVisible();
  });

  test("shows general email link in Get in touch", async ({ page }) => {
    const emailLinks = page.getByRole("link", { name: "hello@wagelab.co.uk" });
    await expect(emailLinks.first()).toBeVisible();
    await expect(emailLinks.first()).toHaveAttribute("href", "mailto:hello@wagelab.co.uk");
  });

  test("shows Specific enquiries section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Specific enquiries" })).toBeVisible();
  });

  test("shows all four enquiry categories", async ({ page }) => {
    await expect(page.getByText("Press & media")).toBeVisible();
    await expect(page.getByText("Partnerships & affiliates")).toBeVisible();
    await expect(page.getByText("Technical issues")).toBeVisible();
    await expect(page.getByText("Data protection & privacy")).toBeVisible();
  });

  test("shows technical issues note about browser and device", async ({ page }) => {
    await expect(page.getByText(/Include your browser and device type/)).toBeVisible();
  });

  test("shows Corrections section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Corrections" })).toBeVisible();
    await expect(page.getByText(/error in the calculator/)).toBeVisible();
  });

  test("shows link to FAQ in CTA", async ({ page }) => {
    const faqLink = page.getByRole("link", { name: "Check the FAQ" });
    await expect(faqLink).toBeVisible();
    await expect(faqLink).toHaveAttribute("href", "/faq");
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
