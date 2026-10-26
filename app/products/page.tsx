"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Product = { id: string; brand: string; model: string; price: number };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setProducts(data);
      })
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page">
      <h1>Products</h1>
      <p className="description">All laptops currently in stock.</p>

      <div className="actions">
        <Link className="btn" href="/products/new">+ Add product</Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="productGrid">
  {products.map((p) => (
    <Link key={p.id} href={`/products/${p.id}`} className="productCard">
      <div className="productThumb">💻</div>
      <div className="productInfo">
        <span className={`badge badge-${p.brand.toLowerCase()}`}>{p.brand}</span>
        <h2>{p.model}</h2>
        <p className="price">€{p.price}</p>
      </div>
    </Link>
  ))}
</div>
    </section>
  );
}
