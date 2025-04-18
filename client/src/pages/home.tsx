import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NewsTicker } from "@/components/news-ticker";
import { NewsCard } from "@/components/news-card";
import { NewsSlider } from "@/components/news-slider";
import { CategoryFilter } from "@/components/category-filter";
import { NewsletterSignup } from "@/components/sidebar/newsletter-signup";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export default function Home() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [newsPage, setNewsPage] = useState(1);
  
  // Featured articles
  const { data: featuredArticles, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['/api/articles/featured'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Main news articles
  const { data: newsArticles, isLoading: isNewsLoading } = useQuery({
    queryKey: ['/api/articles', { category: categoryFilter }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Most read articles
  const { data: mostReadArticles, isLoading: isMostReadLoading } = useQuery({
    queryKey: ['/api/articles/trending', { limit: 5 }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Editors' picks
  const { data: editorsPicks, isLoading: isEditorsPicksLoading } = useQuery({
    queryKey: ['/api/articles/editors-picks', { limit: 3 }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleCategoryChange = (category: string | null) => {
    setCategoryFilter(category);
    setNewsPage(1);
  };

  // Calculate pagination
  const articlesPerPage = 4;
  const paginatedArticles = newsArticles?.slice(0, newsPage * articlesPerPage);
  const hasMoreArticles = newsArticles && paginatedArticles?.length < newsArticles.length;

  const loadMoreArticles = () => {
    setNewsPage(prev => prev + 1);
  };
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };
  
  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Header />
      <NewsTicker />
      
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <motion.section 
          className="mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {isFeaturedLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Skeleton className="h-[400px] w-full rounded-lg" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-[190px] w-full rounded-lg" />
                <Skeleton className="h-[190px] w-full rounded-lg" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredArticles?.[0] && (
                <div className="lg:col-span-2">
                  <NewsCard article={featuredArticles[0]} variant="featured" />
                </div>
              )}
              
              <div className="space-y-6">
                {featuredArticles?.[1] && (
                  <NewsCard article={featuredArticles[1]} variant="overlay" />
                )}
                {featuredArticles?.[2] && (
                  <NewsCard article={featuredArticles[2]} variant="overlay" />
                )}
              </div>
            </div>
          )}
        </motion.section>

        {/* Trending Stories Slider */}
        <NewsSlider 
          title="Trending Stories" 
          endpoint="/api/articles/trending"
          limit={8}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main News Column */}
          <motion.div 
            className="lg:col-span-8"
            initial="hidden"
            animate="visible"
            variants={slideUp}
          >
            {/* Category Filter Tabs */}
            <CategoryFilter 
              onCategoryChange={handleCategoryChange}
              activeCategory={categoryFilter}
            />
            
            {/* News Articles List */}
            <div className="space-y-8">
              {isNewsLoading ? (
                // Loading skeletons
                Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="bg-white p-5 rounded-lg shadow-md flex flex-col md:flex-row gap-5">
                    <div className="md:w-1/3">
                      <Skeleton className="w-full h-56 md:h-40 rounded-md" />
                    </div>
                    <div className="md:w-2/3">
                      <div className="flex items-center mb-2">
                        <Skeleton className="h-5 w-20 mr-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-7 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <div className="flex items-center">
                        <Skeleton className="w-8 h-8 rounded-full mr-3" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </div>
                ))
              ) : paginatedArticles?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-neutral-dark">No articles found in this category.</p>
                </div>
              ) : (
                paginatedArticles?.map(article => (
                  <NewsCard key={article.id} article={article} variant="compact" />
                ))
              )}
              
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
            </div>
          </motion.div>
          
          {/* Sidebar */}
          <motion.div 
            className="lg:col-span-4"
            initial="hidden"
            animate="visible"
            variants={slideUp}
            transition={{ delay: 0.2 }}
          >
            {/* Newsletter Signup */}
            <NewsletterSignup className="mb-8" />
            
            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-['Playfair_Display'] font-bold mb-4">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                <Link href="/category/climate-change">
                  <a className="bg-neutral-lighter hover:bg-neutral-light text-neutral-darkest px-3 py-1 rounded-full text-sm transition-colors">Climate Change</a>
                </Link>
                <Link href="/category/ai">
                  <a className="bg-neutral-lighter hover:bg-neutral-light text-neutral-darkest px-3 py-1 rounded-full text-sm transition-colors">Artificial Intelligence</a>
                </Link>
                <Link href="/category/economy">
                  <a className="bg-neutral-lighter hover:bg-neutral-light text-neutral-darkest px-3 py-1 rounded-full text-sm transition-colors">Global Economy</a>
                </Link>
                <Link href="/category/healthcare">
                  <a className="bg-neutral-lighter hover:bg-neutral-light text-neutral-darkest px-3 py-1 rounded-full text-sm transition-colors">Healthcare</a>
                </Link>
                <Link href="/category/cybersecurity">
                  <a className="bg-neutral-lighter hover:bg-neutral-light text-neutral-darkest px-3 py-1 rounded-full text-sm transition-colors">Cybersecurity</a>
                </Link>
                <Link href="/category/space">
                  <a className="bg-neutral-lighter hover:bg-neutral-light text-neutral-darkest px-3 py-1 rounded-full text-sm transition-colors">Space Exploration</a>
                </Link>
                <Link href="/category/energy">
                  <a className="bg-neutral-lighter hover:bg-neutral-light text-neutral-darkest px-3 py-1 rounded-full text-sm transition-colors">Renewable Energy</a>
                </Link>
              </div>
            </div>
            
            {/* Most Read Articles */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-['Playfair_Display'] font-bold mb-4">Most Read</h3>
              {isMostReadLoading ? (
                <ul className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <li key={index} className="border-b border-neutral-lighter pb-4 last:border-0 last:pb-0">
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-5 w-full" />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-4">
                  {mostReadArticles?.map(article => (
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
            
            {/* Featured Video */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-['Playfair_Display'] font-bold mb-4">Featured Video</h3>
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80" 
                  alt="News report video thumbnail" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 bg-primary/80 hover:bg-primary rounded-full flex items-center justify-center text-white transition-colors" aria-label="Play video">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
              <h4 className="font-medium mt-3">Special Report: Inside the Global Response to Climate Change</h4>
              <p className="text-neutral-medium text-sm mt-1">12:45 • June 20, 2024</p>
            </div>
          </motion.div>
        </div>

        {/* Live Updates Section */}
        <motion.section 
          className="mt-12 mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-secondary/10 rounded-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl font-['Playfair_Display'] font-bold text-secondary mb-2 md:mb-0">Live Updates</h2>
              <div className="flex items-center space-x-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium">Updates automatically refresh</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-secondary pl-4 pb-4">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-secondary">2 minutes ago</span>
                  <span className="bg-secondary/20 text-secondary px-2 py-1 text-xs uppercase font-['Roboto_Condensed'] tracking-wider rounded-sm">Breaking</span>
                </div>
                <h3 className="font-medium mb-1">Global Stock Markets React to Central Bank Interest Rate Decision</h3>
                <p className="text-neutral-dark text-sm">Financial markets worldwide are responding to the unexpected decision by central banks to hold interest rates steady despite inflation concerns.</p>
              </div>
              
              <div className="border-l-4 border-neutral-light pl-4 pb-4">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-neutral-medium">15 minutes ago</span>
                  <span className="bg-neutral-lighter text-neutral-dark px-2 py-1 text-xs uppercase font-['Roboto_Condensed'] tracking-wider rounded-sm">Update</span>
                </div>
                <h3 className="font-medium mb-1">Tech Conference Showcases Next Generation of AI Innovations</h3>
                <p className="text-neutral-dark text-sm">Industry leaders are presenting cutting-edge AI technologies at the annual tech conference, with demonstrations of applications across healthcare, transportation, and education.</p>
              </div>
              
              <div className="border-l-4 border-neutral-light pl-4 pb-4">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-neutral-medium">42 minutes ago</span>
                  <span className="bg-neutral-lighter text-neutral-dark px-2 py-1 text-xs uppercase font-['Roboto_Condensed'] tracking-wider rounded-sm">Update</span>
                </div>
                <h3 className="font-medium mb-1">Space Agency Provides Update on Mars Mission Progress</h3>
                <p className="text-neutral-dark text-sm">Scientists report significant milestones in the ongoing Mars exploration mission, with new data being transmitted from the rover currently operating on the planet's surface.</p>
              </div>
            </div>
            
            <Button className="w-full mt-6 bg-white hover:bg-neutral-lightest text-secondary font-medium py-2 rounded-md transition-colors border border-secondary/20">
              View All Updates
            </Button>
          </div>
        </motion.section>

        {/* Editor's Picks */}
        <motion.section 
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-['Playfair_Display'] font-bold mb-6">Editor's Picks</h2>
          
          {isEditorsPicksLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <Skeleton className="h-5 w-20 mr-auto" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-7 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex items-center border-t border-neutral-lighter pt-4">
                      <Skeleton className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {editorsPicks?.map(article => (
                <NewsCard 
                  key={article.id} 
                  article={article} 
                  variant="editors-pick" 
                />
              ))}
            </div>
          )}
        </motion.section>
      </main>

      <Footer />
    </>
  );
}
