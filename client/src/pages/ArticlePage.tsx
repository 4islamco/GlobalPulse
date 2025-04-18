import React, { useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Article, Author, Category } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, Bookmark, Share2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const ArticlePage: React.FC = () => {
  const { slug } = useParams();
  
  // Get article by slug
  const { data: article, isLoading: articleLoading } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
  });

  // Get categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Get authors
  const { data: authors } = useQuery<Author[]>({
    queryKey: ['/api/authors'],
  });

  // Find category and author
  const category = categories?.find(cat => article && cat.id === article.categoryId);
  const author = authors?.find(a => article && a.id === article.authorId);

  // Format published date
  const formattedDate = article 
    ? format(new Date(article.publishedAt), 'MMMM dd, yyyy') 
    : '';

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (articleLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-[400px] w-full mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3">
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-8" />
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-full mb-4" />
          </div>
          <div className="md:col-span-1">
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-60 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-headline font-bold mb-4">Article Not Found</h1>
        <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
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
      className="pb-16"
    >
      {/* Article Header */}
      <div className="bg-white border-b border-neutral-200 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/">
              <a className="inline-flex items-center text-sm text-neutral-400 hover:text-primary mb-4 transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Home
              </a>
            </Link>
            
            {category && (
              <Link href={`/category/${category.slug}`}>
                <a 
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4" 
                  style={{ 
                    backgroundColor: `${category.color}15`,
                    color: category.color
                  }}
                >
                  {category.name}
                </a>
              </Link>
            )}
            
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-500 leading-tight mb-4">
              {article.title}
            </h1>
            
            <p className="text-xl text-neutral-400 mb-6">
              {article.summary}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-neutral-400">
              <div className="flex items-center">
                {author?.avatar && (
                  <img 
                    src={author.avatar} 
                    alt={author.name} 
                    className="w-10 h-10 rounded-full object-cover mr-3 border border-neutral-200"
                  />
                )}
                <div>
                  <div className="font-medium text-neutral-500">{author?.name}</div>
                  <div className="text-neutral-400">{author?.title}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{article.readTime} min read</span>
                </div>
                <div>{formattedDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Article Image */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-lg mb-8">
            <img 
              src={article.image || ''} 
              alt={article.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Article Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="prose prose-lg max-w-none">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {/* Article Footer */}
            <div className="mt-12 pt-6 border-t border-neutral-200">
              <div className="flex flex-wrap justify-between items-center gap-4">
                {category && (
                  <Link href={`/category/${category.slug}`}>
                    <a className="text-sm font-medium px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors">
                      More from {category.name}
                    </a>
                  </Link>
                )}
                
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors">
                    <Bookmark className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-44">
              <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                <h3 className="font-headline font-bold text-lg mb-4">About the Author</h3>
                {author && (
                  <div className="flex flex-col items-center text-center">
                    {author.avatar && (
                      <img 
                        src={author.avatar} 
                        alt={author.name} 
                        className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-neutral-200"
                      />
                    )}
                    <div className="font-medium text-neutral-500">{author.name}</div>
                    <div className="text-sm text-neutral-400 mb-3">{author.title}</div>
                    <p className="text-sm text-neutral-400">
                      Experienced journalist covering global events with a focus on 
                      {category ? ` ${category.name.toLowerCase()}` : ' current affairs'}.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-primary/5 rounded-xl p-6">
                <h3 className="font-headline font-bold text-lg mb-4">Stay Updated</h3>
                <p className="text-sm text-neutral-500 mb-4">
                  Get the latest news and analysis delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticlePage;
