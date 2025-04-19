import { Article, Category, Author } from "@/lib/types";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface NewsCardProps {
  article: Article;
  display?: 'card' | 'horizontal' | 'featured';
}

const NewsCard = ({ article, display = 'card' }: NewsCardProps) => {
  const { data: category } = useQuery<Category>({
    queryKey: ['/api/categories', article.categoryId],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${article.categoryId}`);
      if (!response.ok) throw new Error("Failed to fetch category");
      return response.json();
    },
  });

  const { data: author } = useQuery<Author>({
    queryKey: ['/api/authors', article.authorId],
    queryFn: async () => {
      const response = await fetch(`/api/authors/${article.authorId}`);
      if (!response.ok) throw new Error("Failed to fetch author");
      return response.json();
    },
  });

  // Format relative time
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  if (display === 'horizontal') {
    return (
      <article className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row">
        <div className="sm:w-1/3 mb-4 sm:mb-0 sm:mr-4">
          <Link href={`/article/${article.id}`}>
            <div className="block h-48 sm:h-32 rounded-lg overflow-hidden cursor-pointer">
              <motion.img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </Link>
        </div>
        <div className="sm:w-2/3">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            {category && (
              <span className={`${category.color} font-medium px-2 py-0.5 rounded`}>
                {category.name}
              </span>
            )}
            <span className="mx-2">•</span>
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
          <h3 className="font-bold text-lg mb-2 font-sans hover:text-secondary transition-colors">
            <Link href={`/article/${article.id}`}>{article.title}</Link>
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.summary}</p>
          <Link href={`/article/${article.id}`}>
            <span className="text-secondary hover:text-secondary/70 text-sm font-medium flex items-center w-max cursor-pointer">
              Continue Reading
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="ml-1 text-xs"
              >
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </span>
          </Link>
        </div>
      </article>
    );
  }

  if (display === 'featured') {
    return (
      <article className="relative h-full overflow-hidden rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70"></div>
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end p-6">
          <div>
            {category && (
              <span className="inline-block bg-primary text-white text-xs font-semibold px-2 py-1 rounded mb-3 tracking-wide uppercase">
                {category.name}
              </span>
            )}
            <h2 className="text-xl md:text-2xl font-bold text-white font-sans mb-2 leading-tight">
              {article.title}
            </h2>
            <p className="text-gray-200 mb-3 line-clamp-2">{article.summary}</p>
            <Link href={`/article/${article.id}`}>
              <span className="inline-flex items-center text-white font-medium hover:underline cursor-pointer">
                Read Full Story
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
              </span>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Default 'card' display
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      <Link href={`/article/${article.id}`}>
        <div className="block group cursor-pointer">
          <div className="relative h-48 overflow-hidden">
            <motion.img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
            {category && (
              <span className={`absolute top-3 left-3 ${category.color} text-xs font-semibold px-2 py-1 rounded`}>
                {category.name}
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2 font-sans group-hover:text-secondary transition-colors">
              {article.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.summary}</p>
            <div className="flex items-center text-xs text-gray-500">
              <span>{formatTimeAgo(article.publishedAt)}</span>
              <span className="mx-2">•</span>
              <span>{article.readingTimeMinutes} min read</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
