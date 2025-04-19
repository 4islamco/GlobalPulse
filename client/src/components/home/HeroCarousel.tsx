import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  const { data: featuredArticles, isLoading, error } = useQuery<Article[]>({
    queryKey: ['/api/featured-articles'],
  });

  // Handle automatic slide transitions
  useEffect(() => {
    if (isAutoPlaying && featuredArticles && featuredArticles.length > 0) {
      autoPlayRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
      }, 7000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [currentSlide, isAutoPlaying, featuredArticles]);

  // Pause auto-play when user interacts with controls
  const handleManualNavigation = (index: number) => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
    
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };

  const handleNext = () => {
    if (featuredArticles) {
      handleManualNavigation((currentSlide + 1) % featuredArticles.length);
    }
  };

  const handlePrev = () => {
    if (featuredArticles) {
      handleManualNavigation((currentSlide - 1 + (featuredArticles?.length || 1)) % (featuredArticles?.length || 1));
    }
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden bg-black" style={{ height: "70vh", maxHeight: "650px", minHeight: "400px" }}>
        <Skeleton className="w-full h-full bg-gray-800" />
      </div>
    );
  }

  if (error || !featuredArticles || featuredArticles.length === 0) {
    return (
      <div className="relative overflow-hidden bg-gray-900 flex items-center justify-center" style={{ height: "50vh", maxHeight: "500px", minHeight: "300px" }}>
        <div className="text-center text-white">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mx-auto mb-4"
          >
            <path d="M17.5 3A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3h11Z"/>
            <rect width="6" height="6" x="9" y="7" rx="1"/>
            <path d="M7 12h2"/>
            <path d="M15 16h2"/>
            <path d="M7 16h6"/>
          </svg>
          <h2 className="text-xl font-bold">No Featured Stories Available</h2>
          <p className="mt-2 text-gray-300">Check back later for breaking news and featured stories.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-black" style={{ height: "70vh", maxHeight: "650px", minHeight: "400px" }}>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70"></div>
      
      {/* Carousel content */}
      <div className="h-full relative">
        <AnimatePresence mode="wait">
          {featuredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              className="absolute inset-0 transition-opacity"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              exit={{ opacity: 0 }}
              style={{ zIndex: index === currentSlide ? 2 : 1 }}
            >
              <motion.img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover"
                initial={{ scale: 1.05 }}
                animate={{ scale: index === currentSlide ? 1 : 1.05 }}
                transition={{ duration: 7 }}
              />
              <div className="absolute inset-0 z-10 flex items-end justify-start p-6 sm:p-10 lg:p-12">
                <motion.div 
                  className="max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 20 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span className="inline-block bg-primary text-white text-xs font-semibold px-2 py-1 rounded mb-3 tracking-wide uppercase">
                    {/* Since we don't have category data in the article, we'll use a placeholder */}
                    Featured
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-sans mb-2 leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-gray-200 mb-4 line-clamp-2 md:line-clamp-3">
                    {article.summary}
                  </p>
                  <Link href={`/article/${article.id}`}>
                    <a className="inline-flex items-center text-white font-medium hover:underline">
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
                    </a>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {featuredArticles.map((_, index) => (
          <button 
            key={index}
            className={`w-2.5 h-2.5 rounded-full bg-white transition-opacity ${
              index === currentSlide ? "opacity-100" : "opacity-50"
            }`}
            aria-current={index === currentSlide}
            aria-label={`Slide ${index + 1}`}
            onClick={() => handleManualNavigation(index)}
          />
        ))}
      </div>
      
      {/* Left/Right controls */}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
        onClick={handlePrev}
        aria-label="Previous slide"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
        onClick={handleNext}
        aria-label="Next slide"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>
  );
};

export default HeroCarousel;
