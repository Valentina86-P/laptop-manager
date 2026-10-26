import { NextResponse } from "next/server";
import { db, authenticate } from "@/lib/database";
import { validateProduct } from "@/lib/validateProduct";

type Params = { params: Promise<{ id: string }> };

// GET /api/products/[id] → one product
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    await authenticate();
    const product = await db.collection("products").getOne(id);
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

// PUT /api/products/[id] → update a product
export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const body = await request.json();
    const result = validateProduct(body);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await authenticate();
    const product = await db.collection("products").update(id, result.data);
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id] → delete a product
export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    await authenticate();
    await db.collection("products").delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}