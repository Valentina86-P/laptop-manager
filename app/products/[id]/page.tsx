"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Product = {
  id: string;
  brand: string;
  model: string;
  price: number;
  description: string;
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
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

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/products");
    else setError("Failed to delete product");
  }

  if (error) return <section className="page"><p className="error">{error}</p></section>;
  if (!product) return <section className="page"><p>Loading...</p></section>;

  return (
    <section className="page">
      <p className="eyebrow">{product.brand}</p>
      <h1>{product.model}</h1>

      <div className="card">
        <p className="price">€{product.price}</p>
        <p>{product.description}</p>
      </div>

      <div className="actions">
        <Link className="btn" href={`/products/${product.id}/edit`}>Edit</Link>
        <button className="btn btnDanger" onClick={handleDelete}>Delete</button>
        <Link className="btn btnSecondary" href="/products/new">+ Add new</Link>
        <Link className="btn btnSecondary" href="/products">Back</Link>
     </div>
    </section>
  );
}