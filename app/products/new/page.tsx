import ProductForm from "@/components/ProductForm";

export default function AddProductPage() {
  return (
    <section className="page">
      <h1>Add Product</h1>
      <p className="description">Fill in the details of the new laptop.</p>
      <ProductForm />
    </section>
  );
}