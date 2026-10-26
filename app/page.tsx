import { getRedis } from "@/lib/redis";

// Read from Redis every time the page loads
export const dynamic = "force-dynamic";

export default async function Home() {
  const redis = await getRedis();
  const text = await redis.hGetAll("homepage"); // all homepage text from the cache

  return (
    <section className="page">
      <p className="eyebrow">{text.eyebrow}</p>
      <h1>{text.title}</h1>
      <p className="description">{text.description}</p>

      <div className="card">
        <h2>{text.welcomeTitle}</h2>
        <p>{text.welcomeText}</p>
      </div>
    </section>
  );
}
