import React, { useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Category, Article, Author } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { NewsCard } from '@/components/ui/news-card';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CategoryPage: React.FC = () => {
  const { slug } = useParams();
  
  // Get category by slug
  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
  });

  // Get articles by category
  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: [`/api/articles/category/${slug}`],
    enabled: !!slug,
  });

  // Get authors
  const { data: authors } = useQuery<Author[]>({
    queryKey: ['/api/authors'],
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Find author by ID
  const findAuthor = (authorId: number) => {
    return authors?.find(author => author.id === authorId);
  };

  if (categoryLoading || articlesLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-1/4 mb-6" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(null).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-headline font-bold mb-4">Category Not Found</h1>
        <p className="mb-6">The category you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <a className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Home
          </a>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/">
            <a className="inline-flex items-center text-sm text-neutral-400 hover:text-primary mb-4 transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Home
            </a>
          </Link>
          <h1 
            className="text-3xl md:text-4xl font-headline font-bold mb-2"
            style={{ color: category.color }}
          >
            {category.name}
          </h1>
          <p className="text-neutral-400 text-lg">
            Latest news and updates from the {category.name.toLowerCase()} section
          </p>
        </div>

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => {
              const author = findAuthor(article.authorId);
              
              return (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  summary={article.summary}
                  image={article.image || ''}
                  slug={article.slug}
                  categoryName={category.name}
                  categorySlug={category.slug}
                  categoryColor={category.color}
                  publishedAt={article.publishedAt}
                  author={author ? { name: author.name, avatar: author.avatar || undefined } : undefined}
                  readTime={article.readTime}
                  isExclusive={article.exclusive}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow">
            <h2 className="text-xl font-headline font-bold mb-2">No Articles Found</h2>
            <p className="text-neutral-400 mb-6">
              There are currently no articles in this category. Please check back later for updates.
            </p>
            <Link href="/">
              <a className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md">
                <ChevronLeft className="h-4 w-4 mr-2" /> Back to Home
              </a>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryPage;
