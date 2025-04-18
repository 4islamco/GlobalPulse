import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NewsTicker } from "@/components/news-ticker";
import { NewsCard } from "@/components/news-card";
import { NewsletterSignup } from "@/components/sidebar/newsletter-signup";
import { TrendingTopics } from "@/components/sidebar/trending-topics";
import { LoadingIndicator } from "@/components/loading-indicator";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, ArrowDown } from "lucide-react";

export default function Search() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const articlesPerPage = 8;
  
  // Get search param from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [location]);
  
  // Get all articles and filter client-side
  // In a real app, we would use a search API endpoint
  const { 
    data: allArticles, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['/api/articles'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Filter articles based on search query
  const filteredArticles = allArticles?.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate pagination
  const paginatedArticles = filteredArticles?.slice(0, page * articlesPerPage);
  const hasMoreArticles = filteredArticles && paginatedArticles?.length < filteredArticles.length;
  
  const loadMoreArticles = () => {
    setPage(prev => prev + 1);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      window.history.pushState(
        {}, 
        "", 
        `${window.location.pathname}?q=${encodeURIComponent(searchQuery)}`
      );
      setPage(1); // Reset pagination when search changes
    }
  };
  
  if (isLoading) {
    return (
      <>
        <Header />
        <NewsTicker />
        <div className="container mx-auto px-4 py-16">
          <LoadingIndicator message="Searching articles..." />
        </div>
        <Footer />
      </>
    );
  }
  
  if (isError) {
    return (
      <>
        <Header />
        <NewsTicker />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="mb-6">There was an error processing your search. Please try again.</p>
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
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-['Playfair_Display'] font-bold mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Articles'}
          </h1>
          
          <form onSubmit={handleSearch} className="flex max-w-2xl mb-6">
            <Input
              type="search"
              placeholder="Search for news articles..."
              className="rounded-r-none border-r-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="rounded-l-none">
              <SearchIcon className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
          
          {searchQuery && (
            <p className="text-neutral-dark">
              {filteredArticles?.length} {filteredArticles?.length === 1 ? 'result' : 'results'} found
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {searchQuery ? (
              filteredArticles?.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <h2 className="text-xl font-medium mb-2">No Results Found</h2>
                  <p className="text-neutral-medium mb-4">
                    We couldn't find any articles matching your search. Try different keywords or browse our categories.
                  </p>
                </div>
              ) : (
                <>
                  {/* Article Grid */}
                  <div className="space-y-6">
                    {paginatedArticles?.map(article => (
                      <NewsCard key={article.id} article={article} variant="compact" />
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
                        <span>Load More Results</span>
                        <ArrowDown className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-medium mb-2">Start Searching</h2>
                <p className="text-neutral-medium mb-4">
                  Enter keywords in the search box to find articles across all categories.
                </p>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <NewsletterSignup className="mb-8" />
            <TrendingTopics className="mb-8" />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
