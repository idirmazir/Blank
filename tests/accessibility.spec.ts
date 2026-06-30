import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Audit", () => {
  test("homepage — no critical violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");
    const serious = results.violations.filter((v) => v.impact === "serious");

    console.log(`Homepage: ${results.violations.length} violations`);
    results.violations.forEach((v) => {
      console.log(`  [${v.impact}] ${v.id}: ${v.description}`);
    });

    expect(critical).toHaveLength(0);
    expect(serious).toHaveLength(0);
  });

  test("shop — no critical violations", async ({ page }) => {
    await page.goto("/shop");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");
    console.log(`Shop: ${results.violations.length} violations`);
    results.violations.forEach((v) => {
      console.log(`  [${v.impact}] ${v.id}: ${v.description}`);
    });

    expect(critical).toHaveLength(0);
  });

  test("login — no critical violations", async ({ page }) => {
    await page.goto("/account/login");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");
    console.log(`Login: ${results.violations.length} violations`);

    expect(critical).toHaveLength(0);
  });

  test("signup — no critical violations", async ({ page }) => {
    await page.goto("/account/signup");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");
    console.log(`Signup: ${results.violations.length} violations`);

    expect(critical).toHaveLength(0);
  });

  test("cart — no critical violations", async ({ page }) => {
    await page.goto("/cart");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");
    console.log(`Cart: ${results.violations.length} violations`);

    expect(critical).toHaveLength(0);
  });
});
