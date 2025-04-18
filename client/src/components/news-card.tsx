import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  readTime: number;
  category: {
    id: number;
    name: string;
    slug: string;
    color: string;
  };
  author: {
    id: number;
    name: string;
    role: string;
    avatar: string;
  };
}

interface NewsCardProps {
  article: Article;
  variant?: "featured" | "standard" | "compact" | "overlay" | "editors-pick";
  className?: string;
}

export function NewsCard({ article, variant = "standard", className }: NewsCardProps) {
  const formattedDate = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

  const CategoryBadge = () => (
    <span 
      className="px-2 py-1 text-xs uppercase font-['Roboto_Condensed'] tracking-wider rounded-sm inline-block transition-transform hover:scale-105"
      style={{ 
        backgroundColor: variant === "standard" ? "#F5F5F5" : `${article.category.color}${variant === "overlay" ? "" : "10"}`,
        color: variant === "standard" ? "#424242" : variant === "overlay" ? "white" : article.category.color
      }}
    >
      {article.category.name}
    </span>
  );

  if (variant === "featured") {
    return (
      <motion.article 
        className={cn("relative overflow-hidden rounded-lg shadow-lg group", className)}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Link href={`/article/${article.slug}`}>
            <a>
              <CategoryBadge />
              <h2 className="text-white text-2xl md:text-3xl font-['Playfair_Display'] font-bold my-2">{article.title}</h2>
              <p className="text-white/90 mb-3 line-clamp-2">{article.excerpt}</p>
              <div className="flex items-center text-white/80 text-sm">
                <span>By {article.author.name}</span>
                <span className="mx-2">•</span>
                <span>{formattedDate}</span>
              </div>
            </a>
          </Link>
        </div>
      </motion.article>
    );
  }

  if (variant === "overlay") {
    return (
      <motion.article 
        className={cn("relative overflow-hidden rounded-lg shadow-lg group", className)}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-[190px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link href={`/article/${article.slug}`}>
            <a>
              <CategoryBadge />
              <h3 className="text-white text-lg font-['Playfair_Display'] font-bold mb-1 mt-2">{article.title}</h3>
              <div className="flex items-center text-white/80 text-sm">
                <span>By {article.author.name}</span>
                <span className="mx-2">•</span>
                <span>{formattedDate}</span>
              </div>
            </a>
          </Link>
        </div>
      </motion.article>
    );
  }

  if (variant === "compact") {
    return (
      <motion.article 
        className={cn("bg-white p-5 rounded-lg shadow-md flex flex-col md:flex-row gap-5", className)}
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="md:w-1/3">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-56 md:h-40 object-cover rounded-md"
          />
        </div>
        <div className="md:w-2/3">
          <div className="flex items-center mb-2">
            <CategoryBadge />
            <span className="text-neutral-medium text-sm ml-2">{formattedDate}</span>
          </div>
          <Link href={`/article/${article.slug}`}>
            <a>
              <h3 className="font-['Playfair_Display'] font-bold text-xl mb-2">{article.title}</h3>
              <p className="text-neutral-dark mb-3 line-clamp-2">{article.excerpt}</p>
            </a>
          </Link>
          <div className="flex items-center">
            <img 
              src={article.author.avatar} 
              alt={article.author.name} 
              className="w-8 h-8 rounded-full object-cover mr-3"
            />
            <span className="text-sm font-medium">By {article.author.name}</span>
          </div>
        </div>
      </motion.article>
    );
  }

  if (variant === "editors-pick") {
    return (
      <motion.article 
        className={cn("bg-white rounded-lg shadow-md overflow-hidden", className)}
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        transition={{ duration: 0.3 }}
      >
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-5">
          <div className="flex items-center mb-3">
            <CategoryBadge />
            <span className="text-neutral-medium text-xs ml-auto">{formattedDate}</span>
          </div>
          <Link href={`/article/${article.slug}`}>
            <a>
              <h3 className="font-['Playfair_Display'] font-bold text-xl mb-3">{article.title}</h3>
              <p className="text-neutral-dark text-sm mb-4 line-clamp-3">{article.excerpt}</p>
            </a>
          </Link>
          <div className="flex items-center border-t border-neutral-lighter pt-4">
            <img 
              src={article.author.avatar} 
              alt={article.author.name} 
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <span className="block text-sm font-medium">{article.author.name}</span>
              <span className="block text-xs text-neutral-medium">{article.author.role}</span>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // Default standard card
  return (
    <motion.article 
      className={cn("bg-white rounded-lg overflow-hidden shadow-md h-full", className)}
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      transition={{ duration: 0.3 }}
    >
      <img 
        src={article.image} 
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <CategoryBadge />
        <Link href={`/article/${article.slug}`}>
          <a>
            <h3 className="font-['Playfair_Display'] font-bold text-lg mb-2 mt-2">{article.title}</h3>
            <p className="text-neutral-dark text-sm mb-3 line-clamp-2">{article.excerpt}</p>
          </a>
        </Link>
        <div className="flex items-center text-neutral-medium text-xs">
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </motion.article>
  );
}
