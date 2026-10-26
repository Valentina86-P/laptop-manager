import { test, expect } from "@playwright/test";

let id: string;

// Before each test: create a temporary product to work with
test.beforeEach(async ({ request }) => {
  const res = await request.post("/api/products", {
    data: { brand: "Dell", model: "Playwright Test", price: 700, description: "Temporary test product" },
  });
  id = (await res.json()).id;
});

// After each test: delete it (no error if it was already deleted)
test.afterEach(async ({ request }) => {
  await request.delete(`/api/products/${id}`);
});

// ---------- View ----------
test("view page shows all product details", async ({ page }) => {
  await page.goto(`/products/${id}`);
  await expect(page.getByRole("heading", { name: "Playwright Test" })).toBeVisible();
  await expect(page.getByText("€700")).toBeVisible();
  await expect(page.getByText("Temporary test product")).toBeVisible();
});

test("view page shows an error for a product that does not exist", async ({ page }) => {
  await page.goto("/products/doesnotexist123");
  await expect(page.getByText("Product not found")).toBeVisible();
});

// ---------- Edit ----------
test("edit page loads with the current values", async ({ page }) => {
  await page.goto(`/products/${id}/edit`);
  await expect(page.getByRole("heading", { name: "Edit Product" })).toBeVisible();
  await expect(page.getByLabel("Model")).toHaveValue("Playwright Test");
  await expect(page.getByLabel("Price")).toHaveValue("700");
});

test("edit saves the new price in the database", async ({ page, request }) => {
  await page.goto(`/products/${id}/edit`);
  await page.getByLabel("Price").fill("799");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page).toHaveURL(new RegExp(`/products/${id}$`));
  await expect(page.getByText("€799")).toBeVisible();

  const product = await (await request.get(`/api/products/${id}`)).json();
  expect(product.price).toBe(799);
});

test("edit rejects an empty model and keeps the old data", async ({ page, request }) => {
  await page.goto(`/products/${id}/edit`);
  await page.getByLabel("Model").fill("");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.locator(".error")).toBeVisible();
  const product = await (await request.get(`/api/products/${id}`)).json();
  expect(product.model).toBe("Playwright Test");
});

// ---------- Delete ----------
test("delete removes the product from the database", async ({ page, request }) => {
  await page.goto(`/products/${id}`);
  page.once("dialog", (dialog) => dialog.accept()); // click OK on "Are you sure?"
  await page.getByRole("button", { name: "Delete" }).click();

  await expect(page).toHaveURL(/\/products$/);
  const res = await request.get(`/api/products/${id}`);
  expect(res.status()).toBe(404);
});

test("cancelling delete keeps the product", async ({ page, request }) => {
  await page.goto(`/products/${id}`);
  page.once("dialog", (dialog) => dialog.dismiss()); // click Cancel
  await page.getByRole("button", { name: "Delete" }).click();

  const res = await request.get(`/api/products/${id}`);
  expect(res.status()).toBe(200);
});