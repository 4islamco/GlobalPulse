import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Clock, User, CalendarIcon, Share2 } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NewsTicker } from "@/components/news-ticker";
import { NewsCard } from "@/components/news-card";
import { NewsletterSignup } from "@/components/sidebar/newsletter-signup";
import { TrendingTopics } from "@/components/sidebar/trending-topics";
import { MostRead } from "@/components/sidebar/most-read";
import { FeaturedVideo } from "@/components/sidebar/featured-video";
import { LoadingIndicator } from "@/components/loading-indicator";

import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export default function Article() {
  const { slug } = useParams();
  
  // Get article details
  const { 
    data: article, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: [`/api/articles/${slug}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Get related articles
  const { 
    data: relatedArticles, 
    isLoading: isRelatedLoading 
  } = useQuery({
    queryKey: [`/api/articles/${slug}/related`],
    staleTime: 5 * 60 * 1000,
    enabled: !!article, // Only fetch when we have the main article
  });
  
  // Scroll to top when navigating to a new article
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  if (isLoading) {
    return (
      <>
        <Header />
        <NewsTicker />
        <div className="container mx-auto px-4 py-16">
          <LoadingIndicator message="Loading article..." />
        </div>
        <Footer />
      </>
    );
  }
  
  if (isError || !article) {
    return (
      <>
        <Header />
        <NewsTicker />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> 
              Back to Homepage
            </Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const formattedDate = format(new Date(article.publishedAt), "MMMM dd, yyyy");
  
  return (
    <>
      <Header />
      <NewsTicker />
      
      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${article.category.slug}`}>{article.category.name}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-muted-foreground">{article.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-8">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Article Image */}
              <div className="relative">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute bottom-0 left-0 px-6 py-2 bg-gradient-to-r from-black/80 to-transparent">
                  <span 
                    className="px-2 py-1 text-xs uppercase font-['Roboto_Condensed'] tracking-wider rounded-sm inline-block text-white"
                    style={{ backgroundColor: article.category.color }}
                  >
                    {article.category.name}
                  </span>
                </div>
              </div>
              
              {/* Article Content */}
              <div className="p-6">
                <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold mb-4">{article.title}</h1>
                
                <div className="flex flex-wrap items-center text-neutral-medium mb-6 gap-x-4 gap-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>By {article.author.name}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{article.readTime} min read</span>
                  </div>
                </div>
                
                {/* Article Excerpt */}
                <p className="text-lg font-medium text-neutral-dark mb-6 border-l-4 border-primary pl-4 py-2 bg-neutral-lighter italic">
                  {article.excerpt}
                </p>
                
                {/* Article Body - Splitting paragraphs */}
                <div className="prose max-w-none text-neutral-dark">
                  {article.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                
                {/* Article Footer */}
                <div className="mt-8 pt-6 border-t border-neutral-lighter">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Author Info */}
                    <div className="flex items-center">
                      <img 
                        src={article.author.avatar} 
                        alt={article.author.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-medium">{article.author.name}</h4>
                        <p className="text-sm text-neutral-medium">{article.author.role}</p>
                      </div>
                    </div>
                    
                    {/* Share Buttons */}
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-neutral-medium hidden sm:block">Share:</span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" className="rounded-full w-8 h-8" aria-label="Share on Facebook">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                          </svg>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full w-8 h-8" aria-label="Share on Twitter">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                          </svg>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full w-8 h-8" aria-label="Share via Email">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
                          </svg>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full w-8 h-8" aria-label="Copy Link">
                          <Share2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            
            {/* Related Articles */}
            {relatedArticles && relatedArticles.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-['Playfair_Display'] font-bold mb-4">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedArticles.map(article => (
                    <NewsCard key={article.id} article={article} variant="standard" />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <NewsletterSignup className="mb-8" />
            <TrendingTopics className="mb-8" />
            <MostRead className="mb-8" />
            <FeaturedVideo />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
