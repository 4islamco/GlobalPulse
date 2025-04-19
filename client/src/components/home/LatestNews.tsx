import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Article, Category } from "@/lib/types";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const LatestNews = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "filtered">("all");

  // Get all categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Get latest news articles
  const { data: articles, isLoading: isLoadingArticles } = useQuery<Article[]>({
    queryKey: ['/api/latest-articles', viewMode, activeCategory],
    queryFn: async () => {
      if (viewMode === "all") {
        const response = await fetch('/api/latest-articles?limit=4');
        if (!response.ok) throw new Error("Failed to fetch latest news");
        return await response.json();
      } else if (activeCategory) {
        const categoryId = categories?.find(c => c.slug === activeCategory)?.id;
        if (!categoryId) return [];
        const response = await fetch(`/api/categories/${categoryId}/articles`);
        if (!response.ok) throw new Error("Failed to fetch category news");
        return await response.json();
      }
      return [];
    },
    enabled: viewMode === "all" || !!activeCategory,
  });

  const handleCategoryChange = (categorySlug: string | null) => {
    if (categorySlug === activeCategory) {
      setActiveCategory(null);
      setViewMode("all");
    } else {
      setActiveCategory(categorySlug);
      setViewMode("filtered");
    }
  };

  const renderSkeleton = () => (
    <div className="space-y-6">
      {[...Array(4)].map((_, index) => (
        <article key={index} className="bg-card p-4 rounded-lg shadow-sm border border-muted flex flex-col sm:flex-row">
          <div className="sm:w-1/3 mb-4 sm:mb-0 sm:mr-4">
            <Skeleton className="h-48 sm:h-32 rounded-lg w-full bg-muted" />
          </div>
          <div className="sm:w-2/3">
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <Skeleton className="h-4 w-20 rounded mr-2 bg-muted" />
              <Skeleton className="h-4 w-16 rounded bg-muted" />
            </div>
            <Skeleton className="h-6 w-full mb-2 bg-muted" />
            <Skeleton className="h-4 w-full mb-3 bg-muted" />
            <Skeleton className="h-4 w-1/3 bg-muted" />
          </div>
        </article>
      ))}
    </div>
  );

  const getCategoryForArticle = (article: Article) => {
    return categories?.find(cat => cat.id === article.categoryId);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-sans flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2 gradient-text"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span className="gradient-text">Latest News</span>
        </h2>
        <div className="flex space-x-2 overflow-x-auto">
          <button 
            className={`py-1 px-3 rounded-md text-sm font-medium ${
              viewMode === "all" 
                ? "gradient-blueberry-red text-white" 
                : "bg-card hover:bg-muted text-foreground border border-muted"
            } transition-colors`}
            onClick={() => { setViewMode("all"); setActiveCategory(null); }}
          >
            All
          </button>
          
          {isLoadingCategories ? (
            <Skeleton className="h-8 w-24 bg-muted" />
          ) : (
            categories?.slice(0, 3).map(category => (
              <button
                key={category.id}
                className={`py-1 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === category.slug 
                    ? "gradient-red-blueberry text-white" 
                    : "bg-card hover:bg-muted text-foreground border border-muted"
                }`}
                onClick={() => handleCategoryChange(category.slug)}
              >
                {category.name}
              </button>
            ))
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        {isLoadingArticles || isLoadingCategories ? (
          renderSkeleton()
        ) : !articles || articles.length === 0 ? (
          <div className="bg-card p-8 rounded-lg shadow-sm border border-muted text-center">
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
              className="mx-auto mb-4 text-muted-foreground opacity-60"
            >
              <path d="M19 7v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7"/>
              <rect width="18" height="4" x="3" y="3" rx="2"/>
              <path d="M9 13h6"/>
              <path d="M9 17h6"/>
            </svg>
            <p className="text-muted-foreground">No articles available at the moment.</p>
          </div>
        ) : (
          <motion.div
            key={viewMode + (activeCategory || "all")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {articles.map((article) => {
              const category = getCategoryForArticle(article);
              return (
                <article key={article.id} className="bg-card p-4 rounded-lg shadow-md hover:shadow-lg transition-all border border-muted flex flex-col sm:flex-row">
                  <div className="sm:w-1/3 mb-4 sm:mb-0 sm:mr-4">
                    <Link href={`/article/${article.id}`}>
                      <div className="h-48 sm:h-32 rounded-lg overflow-hidden block cursor-pointer border border-primary/20 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
                        <img 
                          src={article.imageUrl} 
                          alt={article.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="sm:w-2/3">
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      {category && (
                        <span className="font-medium px-2 py-0.5 rounded-md mr-2 gradient-blueberry-red text-white">
                          {category.name}
                        </span>
                      )}
                      <span className="mx-2 opacity-50">•</span>
                      <span>{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 font-sans hover:text-primary transition-colors">
                      <Link href={`/article/${article.id}`}>{article.title}</Link>
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{article.summary}</p>
                    <Link href={`/article/${article.id}`}>
                      <span className="text-primary hover:text-primary/80 text-sm font-medium flex items-center w-max cursor-pointer hover:translate-x-1 transition-transform">
                        Continue Reading
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="ml-1 text-xs"
                        >
                          <path d="m9 18 6-6-6-6"/>
                        </svg>
                      </span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </motion.div>
        )}

        <div className="text-center pt-4">
          <button className="px-6 py-2 border border-primary/30 rounded-md bg-card text-foreground font-medium hover:bg-muted transition-all hover:scale-105">
            Load More News
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
              className="ml-2 inline-block text-primary"
            >
              <path d="M12 5v14"/>
              <path d="m19 12-7 7-7-7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
