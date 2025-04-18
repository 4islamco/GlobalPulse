import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Bookmark, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NewsCardProps {
  title: string;
  summary: string;
  image: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  categoryColor?: string;
  publishedAt: Date | string;
  author?: {
    name: string;
    avatar?: string;
  };
  readTime?: number;
  isExclusive?: boolean;
  className?: string;
  isHorizontal?: boolean;
  isTrending?: boolean;
  trendingPosition?: number;
}

export const NewsCard = ({
  title,
  summary,
  image,
  slug,
  categoryName,
  categorySlug,
  categoryColor = "#1976D2",
  publishedAt,
  author,
  readTime,
  isExclusive = false,
  className,
  isHorizontal = false,
  isTrending = false,
  trendingPosition,
}: NewsCardProps) => {
  const date = typeof publishedAt === 'string' ? new Date(publishedAt) : publishedAt;
  const timeAgo = formatDistanceToNow(date, { addSuffix: false });
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group",
      className
    )}>
      {isHorizontal ? (
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/2">
            <Link href={`/article/${slug}`}>
              <img 
                src={image} 
                alt={title} 
                className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            {isExclusive && (
              <div className="absolute bottom-0 right-0 bg-primary text-white text-xs px-2 py-1 font-medium">
                EXCLUSIVE
              </div>
            )}
            {isTrending && trendingPosition && (
              <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-sm font-semibold">
                #{trendingPosition} Trending
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-5">
            <div className="flex items-center justify-between mb-3">
              <Link href={`/category/${categorySlug}`}>
                <span 
                  className="px-2 py-1 text-xs font-semibold rounded-full" 
                  style={{ 
                    backgroundColor: `${categoryColor}10`, 
                    color: categoryColor 
                  }}
                >
                  {categoryName}
                </span>
              </Link>
              <span className="text-xs text-neutral-300">{timeAgo} ago</span>
            </div>
            <Link href={`/article/${slug}`}>
              <h3 className="font-headline font-bold text-xl text-neutral-500 mb-3 hover:text-primary transition-colors">
                {title}
              </h3>
            </Link>
            <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
              {summary}
            </p>
            <div className="flex items-center justify-between">
              {author && (
                <div className="flex items-center">
                  {author.avatar && (
                    <img 
                      src={author.avatar} 
                      alt={author.name} 
                      className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                    />
                  )}
                  <span className="ml-2 text-xs text-neutral-400">By {author.name}</span>
                </div>
              )}
              <div className="flex items-center space-x-3 text-neutral-300">
                <button className="hover:text-primary transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="hover:text-primary transition-colors">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative">
            <Link href={`/article/${slug}`}>
              <img 
                src={image} 
                alt={title} 
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            {isExclusive && (
              <div className="absolute bottom-0 right-0 bg-primary text-white text-xs px-2 py-1 font-medium">
                EXCLUSIVE
              </div>
            )}
            {isTrending && trendingPosition && (
              <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-sm font-semibold">
                #{trendingPosition} Trending
              </div>
            )}
          </div>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Link href={`/category/${categorySlug}`}>
                <span 
                  className="px-2 py-1 text-xs font-semibold rounded-full" 
                  style={{ 
                    backgroundColor: `${categoryColor}10`, 
                    color: categoryColor 
                  }}
                >
                  {categoryName}
                </span>
              </Link>
              <span className="text-xs text-neutral-300">{timeAgo} ago</span>
            </div>
            <Link href={`/article/${slug}`}>
              <h3 className="font-headline font-bold text-xl text-neutral-500 mb-3 hover:text-primary transition-colors">
                {title}
              </h3>
            </Link>
            <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
              {summary}
            </p>
            <div className="flex items-center justify-between">
              {author && (
                <div className="flex items-center">
                  {author.avatar && (
                    <img 
                      src={author.avatar} 
                      alt={author.name} 
                      className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                    />
                  )}
                  <span className="ml-2 text-xs text-neutral-400">By {author.name}</span>
                </div>
              )}
              <div className="flex items-center space-x-3 text-neutral-300">
                {readTime && (
                  <span className="text-xs">{readTime} min read</span>
                )}
                <button className="hover:text-primary transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="hover:text-primary transition-colors">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};
