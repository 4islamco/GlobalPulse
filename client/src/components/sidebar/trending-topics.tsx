import { Link } from "wouter";

interface TrendingTopicsProps {
  className?: string;
}

const trendingTopics = [
  { name: "Climate Change", slug: "climate-change" },
  { name: "Artificial Intelligence", slug: "ai" },
  { name: "Global Economy", slug: "economy" },
  { name: "Healthcare", slug: "healthcare" },
  { name: "Cybersecurity", slug: "cybersecurity" },
  { name: "Space Exploration", slug: "space" },
  { name: "Renewable Energy", slug: "energy" }
];

export function TrendingTopics({ className }: TrendingTopicsProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-['Playfair_Display'] font-bold mb-4">Trending Topics</h3>
      <div className="flex flex-wrap gap-2">
        {trendingTopics.map((topic, index) => (
          <Link key={index} href={`/category/${topic.slug}`}>
            <a className="bg-neutral-lighter hover:bg-neutral-light text-neutral-darkest px-3 py-1 rounded-full text-sm transition-colors">
              {topic.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
