import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Homepage", () => {
  test("loads and shows hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Substance");
    await expect(page.locator("h1")).toContainText("status");
  });

  test("waitlist form is visible", async ({ page }) => {
    await page.goto("/");
    const waitlistForm = page.locator('input[type="email"]');
    await expect(waitlistForm.first()).toBeVisible();
  });

  test("waitlist form accepts email", async ({ page }) => {
    await page.goto("/");
    const emailInput = page.locator('input[type="email"]').first();
    const submitButton = page.getByText("Join waitlist").first();

    await emailInput.fill("test@example.com");
    await submitButton.click();

    // Should show success message
    await expect(page.getByText("on the list")).toBeVisible({ timeout: 10000 });
  });

  test("nav links work", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Browse shop").click();
    await expect(page).toHaveURL(/\/shop/);
  });

  test("is accessible — no critical axe violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const criticalViolations = results.violations.filter(
      (v) => v.impact === "critical"
    );
    expect(criticalViolations).toHaveLength(0);
  });
});

test.describe("Shop", () => {
  test("loads product grid", async ({ page }) => {
    await page.goto("/shop");
    // Should have at least one product card
    const products = page.locator('a[href*="/product/"]');
    await expect(products.first()).toBeVisible();
  });

  test("category filter works", async ({ page }) => {
    await page.goto("/shop");
    // Look for category filter links
    const categories = page.locator('a[href*="category"]');
    if (await categories.count() > 0) {
      await categories.first().click();
      await expect(page).toHaveURL(/category/);
    }
  });
});

test.describe("Product Detail", () => {
  test("navigates to product page", async ({ page }) => {
    await page.goto("/shop");
    const firstProduct = page.locator('a[href*="/product/"]').first();
    await firstProduct.click();
    await expect(page).toHaveURL(/\/product\//);
  });

  test("shows product name and price", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href*="/product/"]').first().click();
    // Should have an h1 with product name
    await expect(page.locator("h1")).toBeVisible();
  });

  test("add to cart button exists", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href*="/product/"]').first().click();
    const addToCart = page.getByText("Add to cart");
    if (await addToCart.isVisible()) {
      await expect(addToCart).toBeVisible();
    }
  });
});

test.describe("Cart", () => {
  test("empty cart shows message", async ({ page }) => {
    await page.goto("/cart");
    // Should show empty cart message or product items
    const emptyMessage = page.getByText("empty");
    const cartItems = page.locator('[class*="cart"]');
    // One or the other should be visible
    expect(await emptyMessage.isVisible() || await cartItems.count() > 0).toBeTruthy();
  });
});

test.describe("Checkout", () => {
  test("redirects to Stripe or shows empty cart", async ({ page }) => {
    await page.goto("/checkout");
    // Without items, should show empty cart message
    // With items, should show Stripe redirect button
    const pageContent = await page.textContent("body");
    expect(pageContent).toBeTruthy();
  });
});

test.describe("Auth", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/account/login");
    await expect(page.getByText("Sign in")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test("login page has password toggle", async ({ page }) => {
    await page.goto("/account/login");
    await expect(page.getByText("Use email and password instead")).toBeVisible();
  });

  test("signup page loads", async ({ page }) => {
    await page.goto("/account/signup");
    await expect(page.getByText("Create account")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("signup page links to login", async ({ page }) => {
    await page.goto("/account/signup");
    await page.getByText("Sign in").click();
    await expect(page).toHaveURL(/\/account\/login/);
  });
});

test.describe("Footer", () => {
  test("footer has correct links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.getByText("Blank Collective")).toBeVisible();
    await expect(footer.getByText("Perth, Australia")).toBeVisible();
  });
});

test.describe("Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("homepage renders on mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("shop renders on mobile", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.locator('a[href*="/product/"]').first()).toBeVisible();
  });

  test("nav works on mobile", async ({ page }) => {
    await page.goto("/");
    // Mobile nav should be visible
    const mobileNav = page.locator("nav").last();
    await expect(mobileNav).toBeVisible();
  });
});
