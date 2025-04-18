import React, { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NewsCard, Article } from "@/components/news-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface NewsSliderProps {
  title: string;
  endpoint: string;
  limit?: number;
}

export function NewsSlider({ title, endpoint, limit = 8 }: NewsSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: [endpoint],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 768) {
        setSlidesPerView(2);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(3);
      } else {
        setSlidesPerView(4);
      }
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  const slideNext = () => {
    if (!articles) return;
    setCurrentIndex(prev => 
      prev + slidesPerView >= articles.length ? 0 : prev + slidesPerView
    );
  };

  const slidePrev = () => {
    if (!articles) return;
    setCurrentIndex(prev => 
      prev - slidesPerView < 0 ? Math.max(0, articles.length - slidesPerView) : prev - slidesPerView
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index * slidesPerView);
  };

  const totalSlides = articles ? Math.ceil(articles.length / slidesPerView) : 0;

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
          <Skeleton className="w-full h-48" />
          <div className="p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="mb-12 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-['Playfair_Display'] font-bold">{title}</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={slidePrev}
            className="rounded-full"
            disabled={isLoading || !articles || articles.length <= slidesPerView}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={slideNext}
            className="rounded-full"
            disabled={isLoading || !articles || articles.length <= slidesPerView}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        {isLoading ? (
          renderSkeleton()
        ) : (
          <div className="overflow-hidden" ref={sliderRef}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {articles?.slice(currentIndex, currentIndex + slidesPerView).map((article) => (
                  <NewsCard 
                    key={article.id} 
                    article={article} 
                    variant="standard"
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Slider Progress Indicators */}
        {!isLoading && articles && articles.length > slidesPerView && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button 
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / slidesPerView) === index 
                    ? 'bg-primary' 
                    : 'bg-neutral-light'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
