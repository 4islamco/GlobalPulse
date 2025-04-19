import { useQuery } from "@tanstack/react-query";
import { Article, Author } from "@/lib/types";
import { Link } from "wouter";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedReport = () => {
  // Fetch article with ID 13, which is our featured report from the seed data
  const { data: article, isLoading: isLoadingArticle, error: articleError } = useQuery<Article>({
    queryKey: ['/api/articles/13'],
  });

  const { data: author, isLoading: isLoadingAuthor, error: authorError } = useQuery<Author>({
    queryKey: ['/api/authors/1'],
    enabled: !!article,
  });

  if (isLoadingArticle || isLoadingAuthor) {
    return (
      <section className="mb-12 bg-gradient-to-br from-card to-background border border-muted/50 p-6 sm:p-8 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <Skeleton className="h-6 w-32 mr-3 bg-muted" />
              <Skeleton className="h-4 w-48 bg-muted" />
            </div>
            <Skeleton className="h-8 w-full mb-2 bg-muted" />
            <Skeleton className="h-8 w-3/4 mb-4 bg-muted" />
            <Skeleton className="h-4 w-full mb-2 bg-muted" />
            <Skeleton className="h-4 w-full mb-2 bg-muted" />
            <Skeleton className="h-4 w-3/4 mb-6 bg-muted" />
            <div className="flex items-center mb-4">
              <Skeleton className="w-12 h-12 rounded-full mr-3 bg-muted" />
              <div>
                <Skeleton className="h-4 w-32 mb-1 bg-muted" />
                <Skeleton className="h-3 w-48 bg-muted" />
              </div>
            </div>
            <Skeleton className="h-10 w-36 bg-muted" />
          </div>
          <div className="md:w-1/3 h-52 md:h-80 relative rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full bg-muted" />
          </div>
        </div>
      </section>
    );
  }

  if (articleError || authorError || !article) {
    return null; // Don't show this section if there's an error
  }

  const publishDate = article.publishedAt ? format(new Date(article.publishedAt), 'MMMM d, yyyy') : '';

  return (
    <section className="mb-12 bg-gradient-to-br from-card to-background border border-muted/50 p-6 sm:p-8 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
          <div className="flex items-center mb-4">
            <span className="gradient-blueberry-red text-white text-xs font-semibold px-3 py-1.5 rounded-md mr-3">FEATURED REPORT</span>
            <span className="text-muted-foreground text-sm">Published on {publishDate}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans leading-tight mb-4 gradient-text">{article.title}</h2>
          <p className="text-foreground/80 mb-6 line-clamp-3 md:line-clamp-4">{article.summary}</p>
          
          {author && (
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full mr-3 border border-primary/30 p-0.5 overflow-hidden">
                <img 
                  src={author.avatarUrl} 
                  alt={author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-foreground">By {author.name}</p>
                <p className="text-sm text-muted-foreground">{author.title}</p>
              </div>
            </div>
          )}
          
          <Link href={`/article/${article.id}`} className="inline-flex items-center px-4 py-2 gradient-blueberry-red text-white rounded-md hover:opacity-90 transition-all hover:translate-y-[-2px] font-medium">
            Read Full Report
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
              className="ml-2"
            >
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className="md:w-1/3 h-52 md:h-80 relative rounded-lg overflow-hidden border border-primary/20 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10"></div>
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedReport;
