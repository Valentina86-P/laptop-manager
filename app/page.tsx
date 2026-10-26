// app/page.tsx

export default function Home() {
  return (
    <section className="page">
      <p className="eyebrow">Laptop Manager</p>
      <h1>Home</h1>
      <p className="description">
        A simple product management app for laptops, built with Next.js and PocketBase.
      </p>

      <div className="card">
        <h2>Welcome!</h2>
        <p>
          Use this app to view, add, edit and delete laptops in stock.
          Go to Products to see the full list.
        </p>
      </div>
    </section>
  );
}
