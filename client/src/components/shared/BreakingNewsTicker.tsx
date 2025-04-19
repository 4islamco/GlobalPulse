import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { BreakingNews } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

const BreakingNewsTicker = () => {
  const { data: breakingNews, isLoading, error } = useQuery({
    queryKey: ['/api/breaking-news'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  if (isLoading || error || !breakingNews || breakingNews.length === 0) {
    return (
      <div className="bg-primary text-white py-2 px-4 flex items-center">
        <div className="flex-shrink-0 mr-3">
          <span className="font-bold font-mono text-sm bg-white text-primary px-2 py-1 rounded animate-pulse">BREAKING</span>
        </div>
        <div className="overflow-hidden relative flex-1">
          <div className="h-6 animate-pulse bg-primary-400 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="ticker-container bg-primary text-white py-2 px-4 flex items-center">
      <div className="flex-shrink-0 mr-3">
        <motion.span 
          className="font-bold font-mono text-sm bg-white text-primary px-2 py-1 rounded"
          animate={{ opacity: [1, 0.85, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          BREAKING
        </motion.span>
      </div>
      <div className="overflow-hidden relative flex-1">
        <div className="ticker-content">
          {breakingNews.map((news: BreakingNews) => (
            <span key={news.id} className="mr-8 font-mono">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="8"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="inline-block mr-2 mb-1"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
              {news.content}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsTicker;
