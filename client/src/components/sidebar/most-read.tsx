import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface MostReadProps {
  className?: string;
  limit?: number;
}

export function MostRead({ className, limit = 5 }: MostReadProps) {
  const { data: mostReadArticles, isLoading } = useQuery({
    queryKey: ['/api/articles/trending', { limit }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-['Playfair_Display'] font-bold mb-4">Most Read</h3>
      
      {isLoading ? (
        <ul className="space-y-4">
          {Array.from({ length: limit }).map((_, index) => (
            <li key={index} className="border-b border-neutral-lighter pb-4 last:border-0 last:pb-0">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-5 w-full" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-4">
          {mostReadArticles?.map((article: any) => (
            <li key={article.id} className="border-b border-neutral-lighter pb-4 last:border-0 last:pb-0">
              <Link href={`/article/${article.slug}`}>
                <a className="group">
                  <span className="text-neutral-medium text-sm block mb-1">{article.category.name}</span>
                  <h4 className="font-medium group-hover:text-primary transition-colors">{article.title}</h4>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
