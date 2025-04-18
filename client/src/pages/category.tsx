import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NewsTicker } from "@/components/news-ticker";
import { NewsCard } from "@/components/news-card";
import { NewsletterSignup } from "@/components/sidebar/newsletter-signup";
import { TrendingTopics } from "@/components/sidebar/trending-topics";
import { MostRead } from "@/components/sidebar/most-read";
import { LoadingIndicator } from "@/components/loading-indicator";

import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export default function Category() {
  const { slug } = useParams();
  const [page, setPage] = useState(1);
  const articlesPerPage = 8;
  
  // Get category details and articles
  const { 
    data: articles, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: [`/api/articles/category/${slug}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Get category details
  const { 
    data: categories 
  } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  // Find current category
  const currentCategory = categories?.find((cat: any) => cat.slug === slug);
  
  // Calculate pagination
  const paginatedArticles = articles?.slice(0, page * articlesPerPage);
  const hasMoreArticles = articles && paginatedArticles?.length < articles.length;
  
  const loadMoreArticles = () => {
    setPage(prev => prev + 1);
  };
  
  if (isLoading) {
    return (
      <>
        <Header />
        <NewsTicker />
        <div className="container mx-auto px-4 py-16">
          <LoadingIndicator message="Loading articles..." />
        </div>
        <Footer />
      </>
    );
  }
  
  if (isError || !articles) {
    return (
      <>
        <Header />
        <NewsTicker />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="mb-6">The category you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <a href="/">Back to Homepage</a>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <NewsTicker />
      
      <main className="container mx-auto px-4 py-6">
        {/* Category Header */}
        <div className="mb-8">
          <div 
            className="py-6 px-8 rounded-lg mb-6"
            style={{ 
              backgroundColor: currentCategory ? `${currentCategory.color}15` : 'rgba(0,0,0,0.05)',
              borderLeft: currentCategory ? `4px solid ${currentCategory.color}` : '4px solid #D32F2F' 
            }}
          >
            <h1 className="text-3xl font-['Playfair_Display'] font-bold mb-2">
              {currentCategory?.name || 'Category'} News
            </h1>
            <p className="text-neutral-dark">
              Latest news, updates, and analysis on {currentCategory?.name.toLowerCase() || 'this category'}.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {articles.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-medium mb-2">No Articles Found</h2>
                <p className="text-neutral-medium mb-4">
                  There are currently no articles in this category. Check back later for updates.
                </p>
              </div>
            ) : (
              <>
                {/* Featured Article */}
                {articles[0] && (
                  <div className="mb-8">
                    <NewsCard article={articles[0]} variant="featured" />
                  </div>
                )}
                
                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {paginatedArticles?.slice(1).map(article => (
                    <NewsCard key={article.id} article={article} variant="standard" />
                  ))}
                </div>
                
                {/* Load More Button */}
                {hasMoreArticles && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={loadMoreArticles}
                      variant="outline"
                      className="bg-neutral-lighter hover:bg-neutral-light text-neutral-darkest font-medium py-2 px-6 rounded-full transition-colors"
                    >
                      <span>Load More Articles</span>
                      <ArrowDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <NewsletterSignup className="mb-8" />
            <TrendingTopics className="mb-8" />
            <MostRead className="mb-8" />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
