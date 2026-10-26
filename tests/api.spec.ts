import { test, expect } from "@playwright/test";

test("addProduct route creates a product from the URL", async ({ request }) => {
  const res = await request.get("/api/addProduct", {
    params: { brand: "Acer", model: "API Test", description: "Created from URL", price: "650" },
  });
  expect(res.status()).toBe(201);
  const product = await res.json();
  expect(product.model).toBe("API Test");
  expect(product.price).toBe(650);

  await request.delete(`/api/products/${product.id}`); // clean up
});

test("addProduct route rejects a missing price", async ({ request }) => {
  const res = await request.get("/api/addProduct", {
    params: { brand: "Acer", model: "No price", description: "test" },
  });
  expect(res.status()).toBe(400);
});

test("API returns 404 for a product that does not exist", async ({ request }) => {
  const res = await request.get("/api/products/doesnotexist123");
  expect(res.status()).toBe(404);
});