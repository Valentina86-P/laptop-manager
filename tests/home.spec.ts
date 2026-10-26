import { test, expect } from "@playwright/test";

test("home page exists and shows text from Redis", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
  await expect(page.getByText("Welcome to Laptop Manager!")).toBeVisible();
});

test("navigation link to Products works", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Products/ }).click();
  await expect(page).toHaveURL(/\/products$/);
});