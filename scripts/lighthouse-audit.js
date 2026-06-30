#!/usr/bin/env node
/**
 * Lighthouse audit script.
 * Runs performance, accessibility, SEO, and best practices audits.
 * Usage: node scripts/lighthouse-audit.js [url]
 * Default URL: http://localhost:3000
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.argv[2] || "http://localhost:3000";
const OUTPUT_DIR = path.join(process.cwd(), "lighthouse-reports");

const PAGES = [
  { url: "/", name: "homepage" },
  { url: "/shop", name: "shop" },
  { url: "/cart", name: "cart" },
  { url: "/account/login", name: "login" },
  { url: "/account/signup", name: "signup" },
  { url: "/checkout", name: "checkout" },
];

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(`🔍 Running Lighthouse audits against ${BASE_URL}\n`);

let allPassed = true;
const results = [];

for (const page of PAGES) {
  const url = `${BASE_URL}${page.url}`;
  const reportPath = path.join(OUTPUT_DIR, `${page.name}.json`);
  const htmlPath = path.join(OUTPUT_DIR, `${page.name}.html`);

  console.log(`Auditing ${page.name} (${page.url})...`);

  try {
    execSync(
      `npx lighthouse "${url}" --output=json --output=html ` +
      `--output-path="${reportPath}" --output-path="${htmlPath}" ` +
      `--chrome-flags="--headless --no-sandbox --disable-gpu" ` +
      `--only-categories=performance,accessibility,best-practices,seo`,
      { stdio: "pipe", timeout: 60000 }
    );

    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const scores = {
      performance: Math.round((report.categories.performance?.score || 0) * 100),
      accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((report.categories["best-practices"]?.score || 0) * 100),
      seo: Math.round((report.categories.seo?.score || 0) * 100),
    };

    results.push({ page: page.name, url: page.url, ...scores });

    console.log(`  Performance:    ${scores.performance}`);
    console.log(`  Accessibility:  ${scores.accessibility}`);
    console.log(`  Best Practices: ${scores.bestPractices}`);
    console.log(`  SEO:            ${scores.seo}`);

    if (scores.performance < 50 || scores.accessibility < 80) {
      allPassed = false;
    }
    console.log();
  } catch (err) {
    console.log(`  ❌ Failed to audit ${page.name}: ${err.message}\n`);
    allPassed = false;
  }
}

// Summary table
console.log("─".repeat(70));
console.log("SUMMARY");
console.log("─".repeat(70));
console.log(
  "Page".padEnd(15) +
  "Performance".padEnd(15) +
  "Accessibility".padEnd(15) +
  "Best Practices".padEnd(15) +
  "SEO"
);
console.log("─".repeat(70));
for (const r of results) {
  console.log(
    r.page.padEnd(15) +
    String(r.performance).padEnd(15) +
    String(r.accessibility).padEnd(15) +
    String(r.bestPractices).padEnd(15) +
    String(r.seo)
  );
}
console.log("─".repeat(70));
console.log(allPassed ? "✅ All pages passed thresholds" : "⚠ Some pages below threshold");
console.log(`\nReports saved to ${OUTPUT_DIR}/`);

process.exit(allPassed ? 0 : 1);
