import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Article, Author, Category } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export const FeaturedAnalysis: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Get all articles (we'll filter for analysis content client-side)
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  // Get categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Get authors
  const { data: authors } = useQuery<Author[]>({
    queryKey: ['/api/authors'],
  });

  // Helper functions
  const findCategory = (categoryId: number) => {
    return categories?.find(cat => cat.id === categoryId);
  };

  const findAuthor = (authorId: number) => {
    return authors?.find(author => author.id === authorId);
  };

  // Format published time
  const formatPublishedTime = (date: string, includeReadTime?: number) => {
    const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: false });
    return includeReadTime 
      ? `Published ${timeAgo} ago • ${includeReadTime} min read`
      : `${timeAgo} ago`;
  };

  if (isLoading) {
    return (
      <section className="bg-neutral-500 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <Skeleton className="h-8 w-48 bg-neutral-400 mb-4 md:mb-0" />
            <Skeleton className="h-10 w-full md:w-72 bg-neutral-400" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Skeleton className="lg:col-span-8 h-96 bg-neutral-400 rounded-xl" />
            <div className="lg:col-span-4 grid grid-cols-1 gap-6">
              <Skeleton className="h-48 bg-neutral-400 rounded-xl" />
              <Skeleton className="h-48 bg-neutral-400 rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Filter articles for analysis - use long form content with high read time
  const analysisArticles = articles
    ?.filter(article => article.readTime >= 8)
    .sort((a, b) => b.readTime - a.readTime);

  if (!analysisArticles || analysisArticles.length === 0) {
    return null;
  }

  // Filter by category if active filter is set
  const filteredArticles = activeFilter
    ? analysisArticles.filter(article => {
        const category = findCategory(article.categoryId);
        return category?.name.toLowerCase() === activeFilter.toLowerCase();
      })
    : analysisArticles;

  // Get main article and secondary articles
  const mainArticle = filteredArticles[0];
  const secondaryArticles = filteredArticles.slice(1, 3);

  // Categories for filter
  const analysisCategoryOptions = ["Politics", "Economics", "Technology"];

  return (
    <section className="bg-neutral-500 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h2 className="font-headline text-2xl font-bold text-white mb-4 md:mb-0">Featured Analysis</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === null 
                  ? "bg-white text-neutral-500" 
                  : "bg-neutral-400 text-white hover:bg-neutral-300"
              }`}
              onClick={() => setActiveFilter(null)}
            >
              All
            </button>
            {analysisCategoryOptions.map(cat => (
              <button 
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === cat 
                    ? "bg-white text-neutral-500" 
                    : "bg-neutral-400 text-white hover:bg-neutral-300"
                }`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {filteredArticles.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Featured Analysis Main */}
            <div className="lg:col-span-8 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img 
                    src={mainArticle.image} 
                    alt={mainArticle.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">Analysis</span>
                    {findCategory(mainArticle.categoryId) && (
                      <Link href={`/category/${findCategory(mainArticle.categoryId)?.slug}`}>
                        <a className="px-2 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                          {findCategory(mainArticle.categoryId)?.name}
                        </a>
                      </Link>
                    )}
                  </div>
                  <Link href={`/article/${mainArticle.slug}`}>
                    <h3 className="font-headline font-bold text-2xl text-neutral-500 mb-4 hover:text-primary transition-colors">
                      {mainArticle.title}
                    </h3>
                  </Link>
                  <p className="text-neutral-400 text-sm mb-4 line-clamp-4 md:line-clamp-6">
                    {mainArticle.summary}
                  </p>
                  <div className="flex items-center mb-4">
                    {findAuthor(mainArticle.authorId)?.avatar && (
                      <img 
                        src={findAuthor(mainArticle.authorId)?.avatar} 
                        alt={findAuthor(mainArticle.authorId)?.name} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                      />
                    )}
                    <div className="ml-3">
                      <p className="text-neutral-500 font-medium text-sm">{findAuthor(mainArticle.authorId)?.name}</p>
                      <p className="text-neutral-300 text-xs">{findAuthor(mainArticle.authorId)?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-300">
                      {formatPublishedTime(mainArticle.publishedAt.toString(), mainArticle.readTime)}
                    </span>
                    <div className="flex items-center space-x-3 text-neutral-300">
                      <button className="hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      <button className="hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Featured Analysis Secondary */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-6">
              {secondaryArticles.map(article => {
                const category = findCategory(article.categoryId);
                const author = findAuthor(article.authorId);
                
                return (
                  <div key={article.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">Analysis</span>
                        {category && (
                          <Link href={`/category/${category.slug}`}>
                            <a className="px-2 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                              {category.name}
                            </a>
                          </Link>
                        )}
                      </div>
                      <Link href={`/article/${article.slug}`}>
                        <h3 className="font-headline font-bold text-lg text-neutral-500 mb-3 hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {author?.avatar && (
                            <img 
                              src={author.avatar} 
                              alt={author.name} 
                              className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                            />
                          )}
                          <span className="ml-2 text-xs text-neutral-400">By {author?.name}</span>
                        </div>
                        <span className="text-xs text-neutral-300">{article.readTime} min read</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center">
            <h3 className="font-headline font-bold text-xl mb-2">No Analysis Articles Found</h3>
            <p className="text-neutral-400 mb-4">There are currently no analysis articles in this category.</p>
            <button 
              className="px-4 py-2 bg-primary text-white rounded-md"
              onClick={() => setActiveFilter(null)}
            >
              View All Analysis
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
