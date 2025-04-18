import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Article, Author, Category } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export const HeroSection = () => {
  // Get featured articles for hero
  const { data: featuredArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured'],
  });

  // Get categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Get authors
  const { data: authors } = useQuery<Author[]>({
    queryKey: ['/api/authors'],
  });

  // Find category and author for a given article
  const findCategory = (categoryId: number) => {
    return categories?.find(cat => cat.id === categoryId);
  };

  const findAuthor = (authorId: number) => {
    return authors?.find(author => author.id === authorId);
  };

  // Format timestamp
  const formatPublishedTime = (date: string) => {
    const hours = Math.floor((new Date().getTime() - new Date(date).getTime()) / (60 * 60 * 1000));
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  };

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
          <div className="lg:col-span-4 grid grid-cols-1 gap-6">
            <Skeleton className="h-[240px] w-full rounded-xl" />
            <Skeleton className="h-[240px] w-full rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!featuredArticles || featuredArticles.length === 0) {
    return null;
  }

  // Get main article and secondary articles
  const mainArticle = featuredArticles[0];
  const secondaryArticles = featuredArticles.slice(1, 3);
  
  const mainCategory = findCategory(mainArticle.categoryId);
  const mainAuthor = findAuthor(mainArticle.authorId);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Featured Article */}
        <div className="lg:col-span-8 relative group overflow-hidden rounded-xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
          <img 
            src={mainArticle.image} 
            alt={mainArticle.title} 
            className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <Link href={`/category/${mainCategory?.slug}`}>
              <a className="inline-block px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full mb-3">
                {mainCategory?.name}
              </a>
            </Link>
            <Link href={`/article/${mainArticle.slug}`}>
              <h1 className="text-white font-headline text-3xl sm:text-4xl font-bold mb-3 leading-tight hover:text-primary-light transition-colors">
                {mainArticle.title}
              </h1>
            </Link>
            <p className="text-neutral-200 mb-4 max-w-3xl">
              {mainArticle.summary}
            </p>
            <div className="flex items-center text-white/80 text-sm">
              {mainAuthor?.avatar && (
                <img 
                  src={mainAuthor.avatar} 
                  alt={mainAuthor.name} 
                  className="w-8 h-8 rounded-full object-cover mr-2 border border-white/30"
                />
              )}
              <span>By {mainAuthor?.name}</span>
              <span className="mx-2">•</span>
              <span>{formatPublishedTime(mainArticle.publishedAt.toString())}</span>
            </div>
          </div>
        </div>
        
        {/* Secondary Articles */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-6">
          {secondaryArticles.map(article => {
            const category = findCategory(article.categoryId);
            return (
              <div key={article.id} className="relative group overflow-hidden rounded-xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-[240px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <Link href={`/category/${category?.slug}`}>
                    <a className="inline-block px-2 py-1 bg-secondary text-white text-xs font-semibold rounded-full mb-2">
                      {category?.name}
                    </a>
                  </Link>
                  <Link href={`/article/${article.slug}`}>
                    <h2 className="text-white font-headline text-xl font-bold mb-2 leading-tight hover:text-primary-light transition-colors">
                      {article.title}
                    </h2>
                  </Link>
                  <div className="flex items-center text-white/80 text-xs">
                    <span>By {findAuthor(article.authorId)?.name}</span>
                    <span className="mx-2">•</span>
                    <span>{formatPublishedTime(article.publishedAt.toString())}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
