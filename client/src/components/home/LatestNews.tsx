import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Article, Author, Category } from '@shared/schema';
import { NewsCard } from '@/components/ui/news-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface LatestNewsProps {
  categorySlug: string | null;
}

export const LatestNews: React.FC<LatestNewsProps> = ({ categorySlug }) => {
  const [activeTab, setActiveTab] = useState<'newest' | 'mostRead'>('newest');
  const [visibleCount, setVisibleCount] = useState(6);
  
  // Determine what API to call based on if a category is selected
  const queryKey = categorySlug 
    ? [`/api/articles/category/${categorySlug}`, visibleCount] 
    : ['/api/articles/latest', visibleCount];
    
  // Get latest articles
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey,
  });

  // Get categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Get authors
  const { data: authors } = useQuery<Author[]>({
    queryKey: ['/api/authors'],
  });

  // Helper functions to find category and author
  const findCategory = (categoryId: number) => {
    return categories?.find(cat => cat.id === categoryId);
  };

  const findAuthor = (authorId: number) => {
    return authors?.find(author => author.id === authorId);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(null).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline text-2xl font-bold text-neutral-500">Latest News</h2>
        <div className="flex items-center space-x-2">
          <button 
            className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none ${
              activeTab === 'newest' 
                ? 'bg-neutral-100 text-neutral-500' 
                : 'text-neutral-300 hover:bg-neutral-100'
            } transition-colors`}
            onClick={() => setActiveTab('newest')}
          >
            Newest
          </button>
          <button 
            className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none ${
              activeTab === 'mostRead' 
                ? 'bg-neutral-100 text-neutral-500' 
                : 'text-neutral-300 hover:bg-neutral-100'
            } transition-colors`}
            onClick={() => setActiveTab('mostRead')}
          >
            Most Read
          </button>
        </div>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {articles.slice(0, visibleCount).map(article => {
          const category = findCategory(article.categoryId);
          const author = findAuthor(article.authorId);
          
          return (
            <motion.div key={article.id} variants={itemVariants}>
              <NewsCard
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
              />
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Load More Button */}
      {articles.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline"
            className="px-6 py-3 border border-neutral-200 rounded-full text-neutral-500 font-medium flex items-center hover:bg-neutral-100"
            onClick={handleLoadMore}
          >
            Load More News <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
};
