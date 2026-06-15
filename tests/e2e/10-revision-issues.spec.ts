/**
 * Playwright tests covering all 12 issues from the client revision notes
 * (wagelab_developer_revision_notes.docx — 14 June 2026)
 *
 * Issues 3 (Decap CMS / Netlify Identity) and 6 (domain connection) are
 * infrastructure-only and cannot be automated here — they are documented
 * in CHANGES.md and TESTING_GUIDE.md.
 */

import { test, expect } from "@playwright/test";

// ── Issue 1: Mobile Layout Stacking ────────────────────────────────────────

test.describe("Issue 1 — Mobile Layout Stacking", () => {
  test("calculator stacks vertically on a 390px wide screen", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto("/calculator");
    await page.waitForLoadState("networkidle");

    const grid = page.locator(".calc-grid");
    await expect(grid).toBeVisible();

    // On mobile the grid should be column-direction (flex-direction: column)
    const flexDir = await grid.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe("column");

    // Left panel (inputs) must be visible above results
    const leftPanel = page.locator(".calc-left");
    const rightPanel = page.locator(".calc-right");
    await expect(leftPanel).toBeVisible();
    await expect(rightPanel).toBeVisible();

    // Left panel bounding box should be above right panel
    const leftBox = await leftPanel.boundingBox();
    const rightBox = await rightPanel.boundingBox();
    expect(leftBox!.y).toBeLessThan(rightBox!.y);

    await context.close();
  });

  test("calculator tabs are horizontally scrollable on mobile", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto("/calculator");
    await page.waitForLoadState("networkidle");

    const tabs = page.locator(".calc-tabs");
    await expect(tabs).toBeVisible();

    // On mobile, overflow-x should be auto (scrollable)
    const overflow = await tabs.evaluate((el) => getComputedStyle(el).overflowX);
    expect(["auto", "scroll"]).toContain(overflow);

    await context.close();
  });

  test("calculator two-column layout on desktop (1280px)", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    await page.goto("/calculator");
    await page.waitForLoadState("networkidle");

    const grid = page.locator(".calc-grid");
    const display = await grid.evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe("grid");

    // Grid columns should give left panel a fixed width and right panel fills rest
    const templateCols = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    // Should have two columns (e.g. "320px ...")
    const cols = templateCols.split(" ");
    expect(cols.length).toBeGreaterThanOrEqual(2);

    await context.close();
  });
});

// ── Issue 2: Desktop Scrollbar Thickness & Colour ──────────────────────────

test.describe("Issue 2 — Desktop Scrollbar Styling", () => {
  test("globals.css defines magenta scrollbar for desktop", async ({ page }) => {
    await page.goto("/calculator");
    // The Calculator component injects an inline <style> block with the magenta
    // scrollbar rule. Verify that block is present in the DOM.
    const magentaInInlineStyle = await page.evaluate(() => {
      const styles = Array.from(document.querySelectorAll("style"));
      return styles.some(
        (s) =>
          s.textContent?.includes("FF00FF") &&
          s.textContent?.includes("scrollbar-thumb")
      );
    });
    expect(magentaInInlineStyle).toBe(true);
  });

  test("calculator results panel scrollbar is magenta on desktop", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    await page.goto("/calculator");
    await page.waitForLoadState("networkidle");

    // Verify the calc-right element's CSS scrollbar is set to magenta via inline style block
    const magentaFound = await page.evaluate(() => {
      const styles = document.querySelectorAll("style");
      for (const s of styles) {
        if (s.textContent?.includes("calc-right") && s.textContent?.includes("FF00FF")) {
          return true;
        }
      }
      return false;
    });
    expect(magentaFound).toBe(true);
    await context.close();
  });
});

// ── Issues 4 & 5: Affiliates Page + Navigation ─────────────────────────────

test.describe("Issues 4 & 5 — Affiliates Page and Navigation", () => {
  test("Affiliates link appears in desktop navigation between Articles and Download", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("header nav");
    const links = await nav.locator("a").allInnerTexts();
    const idx = (text: string) => links.findIndex((l) => l.includes(text));
    expect(idx("Affiliates")).toBeGreaterThan(idx("Articles"));
    expect(idx("Download")).toBeGreaterThan(idx("Affiliates"));
  });

  test("Affiliates link in mobile hamburger menu", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto("/");
    // Open hamburger
    await page.getByRole("button", { name: /toggle navigation/i }).click();
    await expect(page.getByRole("link", { name: "Affiliates" }).first()).toBeVisible();
    await context.close();
  });

  test("Affiliates page loads at /affiliates", async ({ page }) => {
    await page.goto("/affiliates");
    await expect(page).toHaveURL("/affiliates");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("affiliate partners");
  });

  test("Affiliates page has disclosure statement at the top", async ({ page }) => {
    await page.goto("/affiliates");
    // Disclosure should appear before the provider cards
    const disclosure = page.getByText(/WageLab may earn a commission/).first();
    await expect(disclosure).toBeVisible();
    // Its position should be above any provider card
    const disclosureBox = await disclosure.boundingBox();
    const firstCard = page.locator("a[href='#']").first();
    const cardBox = await firstCard.boundingBox();
    expect(disclosureBox!.y).toBeLessThan(cardBox!.y);
  });

  test("Affiliates page lists SIPPs section with providers", async ({ page }) => {
    await page.goto("/affiliates");
    await expect(page.getByRole("heading", { name: /SIPPs/i })).toBeVisible();
    await expect(page.getByText("Hargreaves Lansdown").first()).toBeVisible();
    await expect(page.getByText("Fidelity").first()).toBeVisible();
    await expect(page.getByText("AJ Bell")).toBeVisible();
    await expect(page.getByText("PensionBee")).toBeVisible();
  });

  test("Affiliates page lists Stocks & Shares ISAs section", async ({ page }) => {
    await page.goto("/affiliates");
    await expect(page.getByRole("heading", { name: /Stocks/i })).toBeVisible();
  });

  test("affiliate link buttons are placeholder # links opening in new tab", async ({ page }) => {
    await page.goto("/affiliates");
    const links = await page.locator("a[href='#']").all();
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });

  test("capital at risk warning appears at the bottom of affiliates page", async ({ page }) => {
    await page.goto("/affiliates");
    await expect(page.getByText(/Capital at risk/)).toBeVisible();
  });

  test("Affiliates page has correct meta title", async ({ page }) => {
    await page.goto("/affiliates");
    await expect(page).toHaveTitle(/Affiliates/);
  });
});

// ── Issue 7: Cookie Consent — Two-tier Banner ──────────────────────────────

test.describe("Issue 7 — Two-tier Cookie Consent Banner", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("wagelab-consent-analytics");
      localStorage.removeItem("wagelab-consent-advertising");
    });
    await page.reload();
  });

  test("banner shows Analytics toggle", async ({ page }) => {
    const banner = page.getByRole("dialog", { name: /cookie/i });
    await expect(banner).toBeVisible();
    await expect(banner.getByText(/Analytics/)).toBeVisible();
  });

  test("banner has Accept all and Decline all buttons", async ({ page }) => {
    const banner = page.getByRole("dialog", { name: /cookie/i });
    await expect(banner.getByRole("button", { name: "Accept all" })).toBeVisible();
    await expect(banner.getByRole("button", { name: "Decline all" })).toBeVisible();
    await expect(banner.getByRole("button", { name: "Save choices" })).toBeVisible();
  });

  test("Accept all closes the banner", async ({ page }) => {
    await page.getByRole("button", { name: "Accept all" }).click();
    await expect(page.getByRole("dialog", { name: /cookie/i })).toBeHidden();
  });

  test("Decline all closes the banner", async ({ page }) => {
    await page.getByRole("button", { name: "Decline all" }).click();
    await expect(page.getByRole("dialog", { name: /cookie/i })).toBeHidden();
  });

  test("Save choices closes the banner", async ({ page }) => {
    await page.getByRole("button", { name: "Save choices" }).click();
    await expect(page.getByRole("dialog", { name: /cookie/i })).toBeHidden();
  });

  test("Accept all saves accepted consent to localStorage", async ({ page }) => {
    await page.getByRole("button", { name: "Accept all" }).click();
    const analyticsConsent = await page.evaluate(() =>
      localStorage.getItem("wagelab-consent-analytics")
    );
    expect(analyticsConsent).toBe("accepted");
  });

  test("Decline all saves declined consent to localStorage", async ({ page }) => {
    await page.getByRole("button", { name: "Decline all" }).click();
    const analyticsConsent = await page.evaluate(() =>
      localStorage.getItem("wagelab-consent-analytics")
    );
    expect(analyticsConsent).toBe("declined");
  });

  test("banner does not reappear on second visit after consent given", async ({ page }) => {
    await page.getByRole("button", { name: "Accept all" }).click();
    await page.reload();
    await expect(page.getByRole("dialog", { name: /cookie/i })).toBeHidden();
  });

  test("cookie policy link is present in banner", async ({ page }) => {
    const banner = page.getByRole("dialog", { name: /cookie/i });
    await expect(banner.getByRole("link", { name: /Cookie Policy/i })).toBeVisible();
  });
});

// ── Issue 8: Success Page ───────────────────────────────────────────────────

test.describe("Issue 8 — Success Page", () => {
  test("success page loads at /success", async ({ page }) => {
    await page.goto("/success");
    await expect(page).toHaveURL("/success");
  });

  test("success page has correct heading", async ({ page }) => {
    await page.goto("/success");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Thank you");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("download is ready");
  });

  test("success page has download button", async ({ page }) => {
    await page.goto("/success");
    const downloadBtn = page.getByRole("link", { name: /Download the Excel Calculator/i });
    await expect(downloadBtn).toBeVisible();
    await expect(downloadBtn).toHaveAttribute("download");
  });

  test("success page shows payment confirmation message", async ({ page }) => {
    await page.goto("/success");
    await expect(page.getByText(/payment was successful/i)).toBeVisible();
  });

  test("success page shows file details", async ({ page }) => {
    await page.goto("/success");
    await expect(page.getByText(/Microsoft Excel/i)).toBeVisible();
    await expect(page.getByText(/Single user licence/i)).toBeVisible();
  });

  test("success page has disclaimer", async ({ page }) => {
    await page.goto("/success");
    await expect(page.getByText(/illustrative purposes only/i).first()).toBeVisible();
    await expect(page.getByText(/not regulated by the FCA/i).first()).toBeVisible();
  });

  test("success page has support contact link", async ({ page }) => {
    await page.goto("/success");
    await expect(page.getByRole("link", { name: /hello@wagelab\.co\.uk/ })).toBeVisible();
  });

  test("success page has noindex robots meta", async ({ page }) => {
    await page.goto("/success");
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute("content", /noindex/i);
  });

  test("success page includes site header and footer", async ({ page }) => {
    await page.goto("/success");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });
});

// ── Issue 9: Article Meta Descriptions ─────────────────────────────────────

test.describe("Issue 9 — Article Meta Descriptions", () => {
  test("article page has meta description tag", async ({ page }) => {
    await page.goto("/articles/the-100k-income-trap");
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute("content", /.+/);
  });

  test("article meta description is non-empty and specific", async ({ page }) => {
    await page.goto("/articles/the-100k-income-trap");
    const content = await page.locator('meta[name="description"]').getAttribute("content");
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(20);
  });

  test("each article has a unique meta description", async ({ page }) => {
    const slugs = ["the-100k-income-trap", "salary-sacrifice-secret", "the-graduate-tax"];
    const descriptions: string[] = [];
    for (const slug of slugs) {
      await page.goto(`/articles/${slug}`);
      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      expect(desc).toBeTruthy();
      descriptions.push(desc!);
    }
    const unique = new Set(descriptions);
    expect(unique.size).toBe(descriptions.length);
  });
});

// ── Issue 10: Sitemap ───────────────────────────────────────────────────────

test.describe("Issue 10 — Sitemap", () => {
  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const contentType = response?.headers()["content-type"] || "";
    expect(contentType).toContain("xml");
  });

  test("sitemap includes the homepage", async ({ page }) => {
    await page.goto("/sitemap.xml");
    const content = await page.content();
    expect(content).toContain("wagelab.co.uk</loc>");
  });

  test("sitemap includes calculator page", async ({ page }) => {
    await page.goto("/sitemap.xml");
    const content = await page.content();
    expect(content).toContain("/calculator");
  });

  test("sitemap includes articles listing page", async ({ page }) => {
    await page.goto("/sitemap.xml");
    const content = await page.content();
    expect(content).toContain("/articles");
  });

  test("sitemap includes affiliates page", async ({ page }) => {
    await page.goto("/sitemap.xml");
    const content = await page.content();
    expect(content).toContain("/affiliates");
  });

  test("sitemap includes at least one article slug", async ({ page }) => {
    await page.goto("/sitemap.xml");
    const content = await page.content();
    expect(content).toContain("the-100k-income-trap");
  });
});

// ── Issue 11: robots.txt ────────────────────────────────────────────────────

test.describe("Issue 11 — robots.txt", () => {
  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
  });

  test("robots.txt allows all crawlers", async ({ page }) => {
    await page.goto("/robots.txt");
    const content = await page.content();
    expect(content).toContain("User-agent: *");
    expect(content).toContain("Allow: /");
  });

  test("robots.txt disallows /admin/ and /api/", async ({ page }) => {
    await page.goto("/robots.txt");
    const content = await page.content();
    expect(content).toContain("Disallow: /admin/");
    expect(content).toContain("Disallow: /api/");
  });

  test("robots.txt references sitemap URL", async ({ page }) => {
    await page.goto("/robots.txt");
    const content = await page.content();
    expect(content).toContain("Sitemap:");
    expect(content).toContain("sitemap.xml");
  });
});

// ── Issue 12: Logo ──────────────────────────────────────────────────────────

test.describe("Issue 12 — Logo", () => {
  test("logo image is present in header", async ({ page }) => {
    await page.goto("/");
    const logo = page.locator("header img[alt='WageLab']");
    await expect(logo).toBeVisible();
  });

  test("logo image loads successfully (no broken image)", async ({ page }) => {
    await page.goto("/");
    const logo = page.locator("header img[alt='WageLab']");
    const naturalWidth = await logo.evaluate(
      (img) => (img as HTMLImageElement).naturalWidth
    );
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test("logo links to homepage", async ({ page }) => {
    await page.goto("/calculator");
    const logoLink = page.locator("header a").filter({ has: page.locator("img[alt='WageLab']") });
    await expect(logoLink).toHaveAttribute("href", "/");
  });

  test("page has favicon link in head", async ({ page }) => {
    await page.goto("/");
    // Next.js injects the favicon as a link tag
    const favicon = page.locator('link[rel*="icon"]').first();
    await expect(favicon).toHaveCount(1);
    const href = await favicon.getAttribute("href");
    expect(href).toBeTruthy();
  });

  test("logo appears on calculator page", async ({ page }) => {
    await page.goto("/calculator");
    const logo = page.locator("header img[alt='WageLab']");
    await expect(logo).toBeVisible();
  });

  test("logo appears on affiliates page", async ({ page }) => {
    await page.goto("/affiliates");
    const logo = page.locator("header img[alt='WageLab']");
    await expect(logo).toBeVisible();
  });
});
