"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Used by both the Add page and the Edit page
export default function ProductForm({ initial, productId }: { initial?: any; productId?: string }) {
  const router = useRouter();

  // All form fields in one object
  const [form, setForm] = useState({
    brand: initial?.brand ?? "",
    model: initial?.model ?? "",
    price: initial?.price ?? "",
    description: initial?.description ?? "",
  });
  const [error, setError] = useState("");

  // Updates the field that was typed in
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Sends the form to the API: POST to add, PUT to edit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = productId ? `/api/products/${productId}` : "/api/products";
    const method = productId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) return setError(data.error);
    router.push(`/products/${data.id}`);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="brand">Brand</label>
        <input id="brand" name="brand" value={form.brand} onChange={handleChange} />
      </div>
      <div className="field">
        <label htmlFor="model">Model</label>
        <input id="model" name="model" value={form.model} onChange={handleChange} />
      </div>
      <div className="field">
        <label htmlFor="price">Price (€)</label>
        <input id="price" name="price" type="number" value={form.price} onChange={handleChange} />
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={form.description} onChange={handleChange} />
      </div>

      {error && <p className="error">{error}</p>}

      <button className="btn" type="submit">
        {productId ? "Save changes" : "Add product"}
      </button>
    </form>
  );
}