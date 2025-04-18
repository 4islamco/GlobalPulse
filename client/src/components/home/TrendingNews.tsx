import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Article, Author, Category } from '@shared/schema';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { NewsCard } from '@/components/ui/news-card';

export const TrendingNews = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get trending articles
  const { data: trendingArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/trending'],
  });

  // Get categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Get authors
  const { data: authors } = useQuery<Author[]>({
    queryKey: ['/api/authors'],
  });

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Helper functions to find category and author
  const findCategory = (categoryId: number) => {
    return categories?.find(cat => cat.id === categoryId);
  };

  const findAuthor = (authorId: number) => {
    return authors?.find(author => author.id === authorId);
  };

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex space-x-4 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="flex-shrink-0 w-72 h-80 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!trendingArticles || trendingArticles.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline text-2xl font-bold text-neutral-500">Trending Now</h2>
        <Link href="/trending">
          <a className="text-secondary font-medium text-sm flex items-center hover:underline">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </div>
      
      <div className="relative" id="trendingSlider">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 flex space-x-4 snap-x hide-scrollbar"
        >
          {trendingArticles.map((article, index) => {
            const category = findCategory(article.categoryId);
            const author = findAuthor(article.authorId);
            
            return (
              <NewsCard
                key={article.id}
                title={article.title}
                summary={article.summary}
                image={article.image || ''}
                slug={article.slug}
                categoryName={category?.name || ''}
                categorySlug={category?.slug || ''}
                categoryColor={category?.color}
                publishedAt={article.publishedAt}
                author={author ? { name: author.name, avatar: author.avatar || undefined } : undefined}
                readTime={article.readTime}
                isExclusive={article.exclusive}
                isTrending={true}
                trendingPosition={index + 1}
                className="flex-shrink-0 w-72 snap-start"
              />
            );
          })}
        </div>
        
        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-neutral-400 hover:text-primary focus:outline-none transition-colors z-10"
          aria-label="Previous trending articles"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-neutral-400 hover:text-primary focus:outline-none transition-colors z-10"
          aria-label="Next trending articles"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
