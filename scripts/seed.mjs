import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");
await pb.collection("_superusers").authWithPassword("sample@test.com", "12345678");

const laptops = [
  { brand: "Dell", model: "XPS 13", price: 1199, description: "13-inch ultrabook with Intel Core Ultra 7, 16GB RAM, 512GB SSD." },
  { brand: "Dell", model: "XPS 15", price: 1799, description: "15-inch laptop with OLED display, 32GB RAM, 1TB SSD." },
  { brand: "Dell", model: "Inspiron 15", price: 649, description: "Everyday 15-inch laptop with Intel Core i5, 8GB RAM, 512GB SSD." },
  { brand: "Dell", model: "Latitude 5440", price: 999, description: "14-inch business laptop with Intel Core i7, 16GB RAM." },
  { brand: "Lenovo", model: "ThinkPad X1 Carbon", price: 1699, description: "Lightweight 14-inch business ultrabook, 16GB RAM, 1TB SSD." },
  { brand: "Lenovo", model: "ThinkPad T14", price: 1099, description: "Durable 14-inch work laptop with AMD Ryzen 7, 16GB RAM." },
  { brand: "Lenovo", model: "IdeaPad Slim 5", price: 749, description: "Slim 14-inch laptop with AMD Ryzen 5, 16GB RAM, 512GB SSD." },
  { brand: "Lenovo", model: "Legion 5", price: 1299, description: "15-inch gaming laptop with RTX 4060, 16GB RAM, 1TB SSD." },
  { brand: "Acer", model: "Swift Go 14", price: 849, description: "14-inch OLED ultrabook with Intel Core Ultra 5, 16GB RAM." },
  { brand: "Acer", model: "Aspire 5", price: 549, description: "Budget 15-inch laptop with Intel Core i5, 8GB RAM, 512GB SSD." },
];

for (const laptop of laptops) {
  await pb.collection("products").create(laptop);
  console.log("Added:", laptop.brand, laptop.model);
}
console.log("Done!");