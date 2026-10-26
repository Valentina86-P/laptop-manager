export type ProductInput = {
  brand: string;
  model: string;
  price: number;
  description: string;
};

// Checks the data sent from a form and returns either an error or clean data
export function validateProduct(body: any):
  | { error: string }
  | { data: ProductInput } {
  const brand = String(body?.brand ?? "").trim();
  const model = String(body?.model ?? "").trim();
  const description = String(body?.description ?? "").trim();
  const price = Number(body?.price);

  if (!brand || !model || !description || body?.price === undefined || body?.price === "") {
    return { error: "Brand, model, price and description are required" };
  }
  if (brand.length > 50 || model.length > 100) {
    return { error: "Brand or model is too long" };
  }
  if (description.length > 1000) {
    return { error: "Description is too long" };
  }
  if (Number.isNaN(price) || price < 0) {
    return { error: "Price must be a positive number" };
  }

  return { data: { brand, model, price, description } };
}