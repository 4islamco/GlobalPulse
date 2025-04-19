import { useQuery } from "@tanstack/react-query";
import { BreakingNews } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

const BreakingNewsTicker = () => {
  const { data: breakingNews, isLoading, error } = useQuery<BreakingNews[]>({
    queryKey: ['/api/breaking-news'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  if (isLoading || error || !breakingNews || breakingNews.length === 0) {
    return (
      <div className="gradient-red-blueberry text-white py-2 px-4 flex items-center shadow-md">
        <div className="flex-shrink-0 mr-3">
          <span className="font-bold font-mono text-sm bg-white/90 text-primary px-2 py-1 rounded-md animate-pulse">BREAKING</span>
        </div>
        <div className="overflow-hidden relative flex-1">
          <div className="h-6 animate-pulse bg-white/20 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="ticker-container gradient-red-blueberry text-white py-2 px-4 flex items-center shadow-md">
      <div className="flex-shrink-0 mr-3">
        <motion.span 
          className="font-bold font-mono text-sm bg-white/90 text-primary px-2 py-1 rounded-md border border-white/30"
          animate={{ opacity: [1, 0.85, 1], scale: [1, 0.98, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          BREAKING
        </motion.span>
      </div>
      <div className="overflow-hidden relative flex-1">
        <div className="ticker-content">
          {breakingNews?.map((news) => (
            <span key={news.id} className="mr-8 font-mono">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="8"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="inline-block mr-2 mb-1 text-white animate-pulse"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="text-white/90">{news.content}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsTicker;
