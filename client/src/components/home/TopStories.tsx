import { useQuery } from "@tanstack/react-query";
import { Article } from "@/lib/types";
import { Link } from "wouter";
import NewsCard from "@/components/shared/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

const TopStories = () => {
  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ['/api/latest-articles'],
    queryFn: async () => {
      const response = await fetch('/api/latest-articles?limit=3');
      if (!response.ok) {
        throw new Error("Failed to fetch top stories");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="p-4">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !articles || articles.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-sans">Top Stories</h2>
        </div>
        <div className="bg-white rounded-lg p-6 text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mx-auto mb-3 text-gray-400"
          >
            <path d="M19 7v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7"/>
            <rect width="18" height="4" x="3" y="3" rx="2"/>
            <path d="M9 13h6"/>
            <path d="M9 17h6"/>
          </svg>
          <p className="text-gray-600">No top stories available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-sans">Top Stories</h2>
        <Link href="/category/all">
          <span className="text-secondary hover:text-secondary/70 font-medium text-sm flex items-center cursor-pointer">
            View All
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="ml-1 text-xs"
            >
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <NewsCard 
            key={article.id}
            article={article}
            display="card"
          />
        ))}
      </div>
    </section>
  );
};

export default TopStories;
