import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Article, Category } from "@/lib/types";
import { Link } from "wouter";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

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
        <article key={index} className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row">
          <div className="sm:w-1/3 mb-4 sm:mb-0 sm:mr-4">
            <Skeleton className="h-48 sm:h-32 rounded-lg w-full" />
          </div>
          <div className="sm:w-2/3">
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <Skeleton className="h-4 w-20 rounded mr-2" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-1/3" />
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
        <h2 className="text-2xl font-bold font-sans">Latest News</h2>
        <div className="flex space-x-2 overflow-x-auto">
          <button 
            className={`bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded text-sm font-medium ${
              viewMode === "all" ? "text-gray-800 bg-gray-200" : "text-gray-600"
            } transition-colors`}
            onClick={() => { setViewMode("all"); setActiveCategory(null); }}
          >
            All
          </button>
          
          {isLoadingCategories ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            categories?.slice(0, 3).map(category => (
              <button
                key={category.id}
                className={`hover:bg-gray-100 py-1 px-3 rounded text-sm font-medium ${
                  activeCategory === category.slug ? "bg-gray-200 text-gray-800" : "text-gray-600"
                } transition-colors`}
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
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
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
              className="mx-auto mb-4 text-gray-400"
            >
              <path d="M19 7v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7"/>
              <rect width="18" height="4" x="3" y="3" rx="2"/>
              <path d="M9 13h6"/>
              <path d="M9 17h6"/>
            </svg>
            <p className="text-gray-600">No articles available at the moment.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode + (activeCategory || "all")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {articles.map((article) => {
                const category = getCategoryForArticle(article);
                return (
                  <article key={article.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 mb-4 sm:mb-0 sm:mr-4">
                      <Link href={`/article/${article.id}`}>
                        <a className="h-48 sm:h-32 rounded-lg overflow-hidden block">
                          <img 
                            src={article.imageUrl} 
                            alt={article.title} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="sm:w-2/3">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        {category && (
                          <span className={`font-medium px-2 py-0.5 rounded mr-2 ${category.color}`}>
                            {category.name}
                          </span>
                        )}
                        <span className="mx-2">•</span>
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 font-sans hover:text-secondary transition-colors">
                        <Link href={`/article/${article.id}`}>{article.title}</Link>
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.summary}</p>
                      <Link href={`/article/${article.id}`}>
                        <a className="text-secondary hover:text-secondary/70 text-sm font-medium flex items-center w-max">
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
                        </a>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="text-center pt-4">
          <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors">
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
              className="ml-2 inline-block"
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
