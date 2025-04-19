import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Article, Category } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import NewsCard from "@/components/shared/NewsCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CategoryNews = () => {
  const [, params] = useRoute("/category/:category");
  const categorySlug = params?.category || "";
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  
  // Fetch all categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Fetch the specific category
  const { data: category, isLoading: isLoadingCategory } = useQuery<Category>({
    queryKey: ['/api/categories', categorySlug],
    queryFn: async () => {
      const response = await fetch(`/api/categories/slug/${categorySlug}`);
      if (!response.ok) {
        if (response.status === 404) {
          // Handle category not found
          return null;
        }
        throw new Error("Failed to fetch category");
      }
      return response.json();
    },
    enabled: categorySlug !== "all",
  });
  
  // Fetch articles for the current category or all articles
  const { data: articles, isLoading: isLoadingArticles } = useQuery<Article[]>({
    queryKey: ['/api/articles', categorySlug, sortBy],
    queryFn: async () => {
      let url = '/api/latest-articles';
      
      if (categorySlug !== "all" && category?.id) {
        url = `/api/categories/${category.id}/articles`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch articles");
      
      let data = await response.json();
      
      // Sort the articles
      if (sortBy === "latest") {
        data.sort((a: Article, b: Article) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      } else {
        data.sort((a: Article, b: Article) => 
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        );
      }
      
      return data;
    },
    enabled: categorySlug === "all" || !!category?.id,
  });
  
  // Set page title
  useEffect(() => {
    if (category) {
      document.title = `${category.name} News | REAL WORLD`;
    } else if (categorySlug === "all") {
      document.title = "All News | REAL WORLD";
    } else {
      document.title = "Category News | REAL WORLD";
    }
  }, [category, categorySlug]);
  
  const getCategoryName = () => {
    if (categorySlug === "all") return "All News";
    return category?.name || "Category";
  };
  
  if (isLoadingCategory || isLoadingArticles) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
        
        <div className="mb-6 flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (categorySlug !== "all" && !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white shadow rounded-lg p-8 text-center">
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
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
            <line x1="2" x2="22" y1="2" y2="22"/>
          </svg>
          <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/">
              <a className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                Return to Homepage
              </a>
            </Link>
            <Link href="/category/all">
              <a className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors">
                Browse All News
              </a>
            </Link>
          </div>
        </div>
        
        {categories && categories.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 text-center">Available Categories</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug}`}>
                  <a className={`px-3 py-1 ${cat.color} rounded-full text-sm hover:opacity-90 transition-opacity`}>
                    {cat.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 font-sans">{getCategoryName()}</h1>
        <p className="text-gray-600 max-w-3xl">
          {categorySlug === "all" 
            ? "Browse all the latest news and articles from across our platform."
            : `The latest news, analysis and updates on ${category?.name.toLowerCase()} from around the world.`
          }
        </p>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        {categories && (
          <div className="flex flex-wrap gap-2">
            <Link href="/category/all">
              <a className={`px-3 py-1 rounded-full text-sm ${
                categorySlug === "all" 
                  ? "bg-gray-800 text-white" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              } transition-colors`}>
                All
              </a>
            </Link>
            {categories.map(cat => (
              <Link key={cat.id} href={`/category/${cat.slug}`}>
                <a className={`px-3 py-1 rounded-full text-sm ${
                  cat.slug === categorySlug 
                    ? cat.color
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                } transition-colors`}>
                  {cat.name}
                </a>
              </Link>
            ))}
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "latest" | "oldest")}
            className="text-sm border-gray-300 rounded-md"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
      
      {!articles || articles.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
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
          <h2 className="text-xl font-bold mb-2">No Articles Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find any articles in this category.</p>
          <Link href="/">
            <a className="inline-flex items-center text-secondary hover:underline">
              Return to Homepage
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
                className="ml-1"
              >
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </Link>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {articles.map(article => (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <NewsCard article={article} display="card" />
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {articles && articles.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" className="flex items-center gap-2">
            Load More
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
            >
              <path d="M12 5v14"/>
              <path d="m19 12-7 7-7-7"/>
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryNews;
