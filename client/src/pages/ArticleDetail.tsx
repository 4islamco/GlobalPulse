import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Article, Author, Category } from "@/lib/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

const ArticleDetail = () => {
  const [, params] = useRoute("/article/:id");
  const articleId = params?.id ? parseInt(params.id) : null;

  // Fetch article details
  const { data: article, isLoading: isLoadingArticle, error: articleError } = useQuery<Article>({
    queryKey: ['/api/articles', articleId],
    queryFn: async () => {
      if (!articleId) throw new Error("Invalid article ID");
      const response = await fetch(`/api/articles/${articleId}`);
      if (!response.ok) throw new Error("Failed to fetch article");
      return response.json();
    },
    enabled: !!articleId,
  });

  // Fetch author details
  const { data: author, isLoading: isLoadingAuthor } = useQuery<Author>({
    queryKey: ['/api/authors', article?.authorId],
    queryFn: async () => {
      if (!article?.authorId) throw new Error("Invalid author ID");
      const response = await fetch(`/api/authors/${article.authorId}`);
      if (!response.ok) throw new Error("Failed to fetch author");
      return response.json();
    },
    enabled: !!article?.authorId,
  });

  // Fetch category details
  const { data: category, isLoading: isLoadingCategory } = useQuery<Category>({
    queryKey: ['/api/categories', article?.categoryId],
    queryFn: async () => {
      if (!article?.categoryId) throw new Error("Invalid category ID");
      const response = await fetch(`/api/categories/${article.categoryId}`);
      if (!response.ok) throw new Error("Failed to fetch category");
      return response.json();
    },
    enabled: !!article?.categoryId,
  });

  // Fetch related articles (articles from the same category)
  const { data: relatedArticles, isLoading: isLoadingRelated } = useQuery<Article[]>({
    queryKey: ['/api/categories', article?.categoryId, 'articles'],
    queryFn: async () => {
      if (!article?.categoryId) throw new Error("Invalid category ID");
      const response = await fetch(`/api/categories/${article.categoryId}/articles`);
      if (!response.ok) throw new Error("Failed to fetch related articles");
      return response.json();
    },
    enabled: !!article?.categoryId,
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  // Set page title
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | REAL WORLD`;
    }
  }, [article]);

  // Filter out current article from related articles and limit to 3
  const filteredRelatedArticles = relatedArticles
    ? relatedArticles
        .filter(relatedArticle => relatedArticle.id !== articleId)
        .slice(0, 3)
    : [];

  if (isLoadingArticle || isLoadingAuthor || isLoadingCategory) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-3/4 mb-6" />
          
          <div className="flex items-center mb-6">
            <Skeleton className="h-12 w-12 rounded-full mr-4" />
            <div>
              <Skeleton className="h-4 w-40 mb-1" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="ml-auto">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        
        <Skeleton className="h-80 w-full mb-8" />
        
        <div className="space-y-4 mb-10">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
        </div>
      </div>
    );
  }

  if (articleError || !article) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
            className="mx-auto mb-4 text-red-500"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" x2="12" y1="8" y2="12"/>
            <line x1="12" x2="12.01" y1="16" y2="16"/>
          </svg>
          <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <a className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
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
                className="mr-2"
              >
                <path d="m11 17-5-5 5-5"/>
                <path d="m18 17-5-5 5-5"/>
              </svg>
              Return to Homepage
            </a>
          </Link>
        </div>
      </div>
    );
  }

  // Function to split content into paragraphs
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        {category && (
          <Link href={`/category/${category.slug}`}>
            <a className={`inline-block ${category.color} text-xs font-semibold px-2 py-1 rounded mb-3`}>
              {category.name}
            </a>
          </Link>
        )}
        
        <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4 leading-tight">
          {article.title}
        </h1>
        
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {article.summary}
        </p>
        
        <div className="flex flex-wrap items-center border-b border-gray-200 pb-6 mb-6">
          {author && (
            <div className="flex items-center mr-auto mb-3 md:mb-0">
              <img 
                src={author.avatarUrl} 
                alt={author.name} 
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <p className="font-medium">{author.name}</p>
                <p className="text-sm text-gray-600">{author.title}</p>
              </div>
            </div>
          )}
          
          <div className="text-gray-600 text-sm flex items-center">
            <span>{formatDate(article.publishedAt)}</span>
            <span className="mx-2">•</span>
            <span>{article.readingTimeMinutes} min read</span>
          </div>
        </div>
      </div>
      
      <div className="mb-8 rounded-lg overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-auto"
        />
      </div>
      
      <article className="prose prose-lg max-w-none mb-10">
        {renderContent(article.content)}
      </article>
      
      {/* Social sharing */}
      <div className="flex items-center justify-center space-x-4 border-t border-b border-gray-200 py-6 mb-10">
        <span className="text-gray-600 font-medium">Share this article:</span>
        <button className="text-blue-600 hover:bg-blue-50 rounded-full p-2 transition-colors">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </button>
        <button className="text-sky-500 hover:bg-sky-50 rounded-full p-2 transition-colors">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
          </svg>
        </button>
        <button className="text-green-600 hover:bg-green-50 rounded-full p-2 transition-colors">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 2 11 13"/>
            <path d="M22 2 15 22 11 13 2 9 22 2z"/>
          </svg>
        </button>
        <button className="text-blue-800 hover:bg-blue-50 rounded-full p-2 transition-colors">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect width="4" height="12" x="2" y="9"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
        </button>
      </div>
      
      {/* Author box */}
      {author && (
        <div className="bg-gray-50 rounded-lg p-6 mb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <img 
              src={author.avatarUrl} 
              alt={author.name} 
              className="w-20 h-20 rounded-full object-cover mb-4 sm:mb-0 sm:mr-6"
            />
            <div>
              <h3 className="text-xl font-bold mb-2 text-center sm:text-left">About {author.name}</h3>
              <p className="text-gray-600 mb-4">
                {author.title} at REAL WORLD. Covering important stories with depth and insight.
              </p>
              <div className="flex justify-center sm:justify-start space-x-3">
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect width="4" height="12" x="2" y="9"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Related articles */}
      {!isLoadingRelated && filteredRelatedArticles.length > 0 && (
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-6 font-sans">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredRelatedArticles.map(relatedArticle => (
              <div key={relatedArticle.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Link href={`/article/${relatedArticle.id}`}>
                  <a className="block group">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={relatedArticle.imageUrl} 
                        alt={relatedArticle.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {relatedArticle.summary}
                      </p>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Subscribe section */}
      <div className="bg-secondary/10 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-3 font-sans">Stay Updated</h3>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
          Subscribe to our newsletter for curated content, breaking news updates, and exclusive stories.
        </p>
        <form className="flex flex-col sm:flex-row max-w-lg mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-grow px-4 py-2 rounded-md sm:rounded-r-none mb-2 sm:mb-0 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
          <button 
            type="submit" 
            className="px-6 py-2 bg-secondary text-white rounded-md sm:rounded-l-none font-medium hover:bg-secondary/90 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArticleDetail;
