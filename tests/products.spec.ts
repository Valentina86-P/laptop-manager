import { test, expect } from "@playwright/test";

test("products page exists and lists all 10 laptops", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByRole("heading", { name: "Products", exact: true })).toBeVisible();
  await expect(page.locator(".productCard")).toHaveCount(10);
});

test("database has 4 Dell, 4 Lenovo and 2 Acer", async ({ request }) => {
  const res = await request.get("/api/products");
  expect(res.status()).toBe(200);
  const products = await res.json();
  const count = (brand: string) => products.filter((p: any) => p.brand === brand).length;
  expect(products).toHaveLength(10);
  expect(count("Dell")).toBe(4);
  expect(count("Lenovo")).toBe(4);
  expect(count("Acer")).toBe(2);
});

test("every product has brand, model, price and description", async ({ request }) => {
  const products = await (await request.get("/api/products")).json();
  for (const p of products) {
    expect(typeof p.brand).toBe("string");
    expect(typeof p.model).toBe("string");
    expect(typeof p.price).toBe("number");
    expect(typeof p.description).toBe("string");
  }
});

test("clicking a product opens its page", async ({ page }) => {
  await page.goto("/products");
  await page.getByRole("link", { name: /XPS 13/ }).click();
  await expect(page).toHaveURL(/\/products\/[a-z0-9]+$/);
  await expect(page.getByRole("heading", { name: "XPS 13" })).toBeVisible();
});

test("add product button opens the add page", async ({ page }) => {
  await page.goto("/products");
  await page.getByRole("link", { name: "+ Add product" }).click();
  await expect(page).toHaveURL(/\/products\/new$/);
});