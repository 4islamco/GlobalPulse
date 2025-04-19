import { useQuery } from "@tanstack/react-query";
import { Article, Author } from "@/lib/types";
import { Link } from "wouter";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const EditorsPicks = () => {
  const { data: articles, isLoading: isLoadingArticles } = useQuery<Article[]>({
    queryKey: ['/api/editors-picks'],
  });

  const { data: authors, isLoading: isLoadingAuthors } = useQuery<Author[]>({
    queryKey: ['/api/authors'],
    enabled: !!articles && articles.length > 0,
  });

  const getAuthorForArticle = (authorId: number) => {
    return authors?.find(author => author.id === authorId);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  if (isLoadingArticles || isLoadingAuthors) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48 bg-card" />
          <Skeleton className="h-5 w-24 bg-card" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-card rounded-lg shadow-sm overflow-hidden border border-muted">
              <Skeleton className="h-44 w-full bg-muted" />
              <div className="p-4">
                <Skeleton className="h-3 w-32 mb-1 bg-muted" />
                <Skeleton className="h-5 w-full mb-2 bg-muted" />
                <Skeleton className="h-5 w-3/4 mb-2 bg-muted" />
                <Skeleton className="h-4 w-full mb-3 bg-muted" />
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-center">
                  <Skeleton className="w-8 h-8 rounded-full mr-2 bg-muted" />
                  <div>
                    <Skeleton className="h-3 w-24 bg-muted" />
                    <Skeleton className="h-2 w-16 mt-1 bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) {
    return null; // Don't show the section if no editor's picks
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-sans flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2 text-accent"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            <path d="M5 3v4"/>
            <path d="M19 17v4"/>
            <path d="M3 5h4"/>
            <path d="M17 19h4"/>
          </svg>
          Editor's Picks
        </h2>
        <Link 
          href="/editors-picks" 
          className="text-secondary hover:text-secondary/70 font-medium text-sm flex items-center"
        >
          View All
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
            className="ml-1 text-xs"
          >
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.slice(0, 4).map((article) => {
          const author = getAuthorForArticle(article.authorId);
          return (
            <motion.div 
              key={article.id} 
              className="bg-card rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md flex flex-col border border-muted"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Link 
                href={`/article/${article.id}`}
                className="block flex-grow group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded border border-muted">
                    {article.readingTimeMinutes} min read
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-secondary mb-1 block">
                    Editor's Choice
                  </span>
                  <h3 className="font-bold text-base mb-2 font-sans group-hover:text-secondary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {article.summary}
                  </p>
                </div>
              </Link>
              {author && (
                <div className="px-4 pb-4 mt-auto">
                  <div className="flex items-center">
                    <img 
                      src={author.avatarUrl} 
                      alt={author.name} 
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <div className="text-xs">
                      <p className="font-medium">{author.name}</p>
                      <p className="text-muted-foreground">{formatDate(article.publishedAt)}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default EditorsPicks;
