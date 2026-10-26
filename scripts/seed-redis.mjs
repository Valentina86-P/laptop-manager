import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

// All text shown on the homepage
await redis.hSet("homepage", {
  eyebrow: "Laptop Manager",
  title: "Home",
  description: "A simple product management app for laptops, built with Next.js and PocketBase.",
  welcomeTitle: "WWelcome to Laptop Manager!",
  welcomeText: "Use this app to view, add, edit and delete laptops in stock. Go to Products to see the full list.",
});

console.log("Saved in Redis:", await redis.hGetAll("homepage"));
await redis.quit();