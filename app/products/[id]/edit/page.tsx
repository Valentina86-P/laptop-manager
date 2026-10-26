"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/ProductForm";

type Product = {
  id: string;
  brand: string;
  model: string;
  price: number;
  description: string;
};

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setProduct(data);
      })
      .catch(() => setError("Failed to load product"));
  }, [id]);

  if (error) return <section className="page"><p className="error">{error}</p></section>;
  if (!product) return <section className="page"><p>Loading...</p></section>;

  return (
    <section className="page">
      <h1>Edit Product</h1>
      <p className="description">Update the details of {product.brand} {product.model}.</p>
      <ProductForm initial={product} productId={product.id} />
    </section>
  );
}