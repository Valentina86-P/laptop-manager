import { test, expect, Page } from "@playwright/test";

// Helper: fill in the add product form
async function fillForm(page: Page, data: { brand: string; model: string; price: string; description: string }) {
  await page.getByLabel("Brand").fill(data.brand);
  await page.getByLabel("Model").fill(data.model);
  await page.getByLabel("Price").fill(data.price);
  await page.getByLabel("Description").fill(data.description);
}

// Helper: delete a test product so the database stays at 10 laptops
async function cleanUp(page: Page) {
  const id = page.url().split("/products/")[1];
  if (id && id !== "new") await page.request.delete(`/api/products/${id}`);
}

const valid = { brand: "Acer", model: "Test Laptop", price: "500", description: "Created by Playwright" };

test("1. add product page exists", async ({ page }) => {
  await page.goto("/products/new");
  await expect(page.getByRole("heading", { name: "Add Product" })).toBeVisible();
  await expect(page.getByLabel("Brand")).toBeVisible();
  await expect(page.getByLabel("Model")).toBeVisible();
  await expect(page.getByLabel("Price")).toBeVisible();
  await expect(page.getByLabel("Description")).toBeVisible();
});

test("2. we can add data into all the fields", async ({ page }) => {
  await page.goto("/products/new");
  await fillForm(page, valid);
  await expect(page.getByLabel("Brand")).toHaveValue("Acer");
  await expect(page.getByLabel("Model")).toHaveValue("Test Laptop");
  await expect(page.getByLabel("Price")).toHaveValue("500");
  await expect(page.getByLabel("Description")).toHaveValue("Created by Playwright");
});

test("3+4. we can submit the data and it exists in the database", async ({ page }) => {
  await page.goto("/products/new");
  await fillForm(page, valid);
  await page.getByRole("button", { name: "Add product" }).click();

  // after submit we are sent to the new product page
  await expect(page).toHaveURL(/\/products\/[a-z0-9]+$/);
  await expect(page.getByRole("heading", { name: "Test Laptop" })).toBeVisible();

  // check the database through the API
  const id = page.url().split("/products/")[1];
  const res = await page.request.get(`/api/products/${id}`);
  expect(res.status()).toBe(200);
  const product = await res.json();
  expect(product.brand).toBe("Acer");
  expect(product.price).toBe(500);

  await cleanUp(page);
});

// 5. Different input strings – invalid ones must be rejected
const invalidInputs = [
  { name: "all fields empty", data: { brand: "", model: "", price: "", description: "" } },
  { name: "spaces only", data: { brand: "   ", model: "   ", price: "500", description: "   " } },
  { name: "very long model (200 chars)", data: { ...valid, model: "A".repeat(200) } },
  { name: "very long description (1001 chars)", data: { ...valid, description: "x".repeat(1001) } },
  { name: "negative price", data: { ...valid, price: "-100" } },
];

for (const input of invalidInputs) {
  test(`5. rejects invalid input: ${input.name}`, async ({ page }) => {
    await page.goto("/products/new");
    await fillForm(page, input.data);
    await page.getByRole("button", { name: "Add product" }).click();
    await expect(page.locator(".error")).toBeVisible(); // error message shown
    await expect(page).toHaveURL(/\/products\/new$/);  // still on the form, nothing saved
  });
}

// 5. Different input strings – unusual but valid ones must be saved safely
const unusualInputs = [
  { name: "short text (1 char)", model: "X" },
  { name: "numbers as text", model: "12345" },
  { name: "wildcards", model: "* % _ ? [abc]" },
  { name: "strange characters", model: "!@#$^&()+={}|;:'\",.<>/~`" },
  { name: "HTML / script tag", model: "<script>alert('hi')</script>" },
  { name: "emoji and accents", model: "Laptop 💻 Ünïcödé" },
];

for (const input of unusualInputs) {
  test(`5. saves unusual input safely: ${input.name}`, async ({ page }) => {
    await page.goto("/products/new");
    await fillForm(page, { ...valid, model: input.model });
    await page.getByRole("button", { name: "Add product" }).click();
    await expect(page).toHaveURL(/\/products\/[a-z0-9]+$/);
    // shown as plain text, exactly as typed (no code executed)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(input.model);
    await cleanUp(page);
  });
}

test("5. API rejects text as price", async ({ request }) => {
  // the number field in the browser blocks letters, so we test the API directly
  const res = await request.post("/api/products", {
    data: { brand: "Acer", model: "Bad price", price: "abc", description: "test" },
  });
  expect(res.status()).toBe(400);
  expect((await res.json()).error).toContain("Price");
});