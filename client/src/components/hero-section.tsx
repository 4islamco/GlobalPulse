import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { NewsCard } from "@/components/news-card";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSection() {
  const { data: featuredArticles, isLoading } = useQuery({
    queryKey: ['/api/articles/featured'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[190px] w-full rounded-lg" />
            <Skeleton className="h-[190px] w-full rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      className="mb-10"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {featuredArticles?.[0] && (
          <div className="lg:col-span-2">
            <NewsCard article={featuredArticles[0]} variant="featured" />
          </div>
        )}
        
        <div className="space-y-6">
          {featuredArticles?.[1] && (
            <NewsCard article={featuredArticles[1]} variant="overlay" />
          )}
          {featuredArticles?.[2] && (
            <NewsCard article={featuredArticles[2]} variant="overlay" />
          )}
        </div>
      </div>
    </motion.section>
  );
}
