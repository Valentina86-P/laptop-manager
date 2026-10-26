import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <main className="content">{children}</main>

        <nav className="bottomNav">
          <Link href="/">
            <span>⌂</span>
            Home
          </Link>

          <Link href="/products">
            <span>▤</span>
            Products
          </Link>

          <Link href="/products/new">
            <span>＋</span>
            Add
          </Link>

          <Link href="/admin">
            <span>▥</span>
            Admin
          </Link>
        </nav>

        


        
      </body>
    </html>
  );
}