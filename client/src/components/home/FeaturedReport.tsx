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
      <section className="mb-12 bg-gradient-to-r from-gray-50 to-gray-100 p-6 sm:p-8 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <Skeleton className="h-6 w-32 mr-3" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <div className="flex items-center mb-4">
              <Skeleton className="w-12 h-12 rounded-full mr-3" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
          <div className="md:w-1/3 h-52 md:h-80 relative rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full" />
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
    <section className="mb-12 bg-gradient-to-r from-gray-50 to-gray-100 p-6 sm:p-8 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
          <div className="flex items-center mb-4">
            <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded mr-3">FEATURED REPORT</span>
            <span className="text-gray-500 text-sm">Published on {publishDate}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans leading-tight mb-4">{article.title}</h2>
          <p className="text-gray-700 mb-6 line-clamp-3 md:line-clamp-4">{article.summary}</p>
          
          {author && (
            <div className="flex items-center mb-4">
              <img 
                src={author.avatarUrl} 
                alt={author.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div>
                <p className="font-medium">By {author.name}</p>
                <p className="text-sm text-gray-600">{author.title}</p>
              </div>
            </div>
          )}
          
          <Link href={`/article/${article.id}`}>
            <a className="inline-flex items-center px-4 py-2 border border-secondary text-secondary rounded-md hover:bg-secondary hover:text-white transition-colors font-medium">
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
            </a>
          </Link>
        </div>
        <div className="md:w-1/3 h-52 md:h-80 relative rounded-lg overflow-hidden">
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
