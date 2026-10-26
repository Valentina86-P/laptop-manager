import { NextResponse } from "next/server";
import { db, authenticate } from "@/lib/database";
import { validateProduct } from "@/lib/validateProduct";

// GET /api/products → list all products
export async function GET() {
  try {
    await authenticate();
    const products = await db.collection("products").getFullList({ sort: "brand,model" });
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

// POST /api/products → create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validateProduct(body);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await authenticate();
    const product = await db.collection("products").create(result.data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}