import React, { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';
import { cn } from '@/lib/utils';

interface CategoryNavProps {
  activeCategorySlug?: string;
  onSelectCategory: (categorySlug: string | null) => void;
}

export const CategoryNav = ({ activeCategorySlug, onSelectCategory }: CategoryNavProps) => {
  const [showAll, setShowAll] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Get categories
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Check if scroll arrows should be shown
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
      }
    };

    // Initial check
    checkScroll();

    // Set up event listener for scroll
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
    }

    // Clean up
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
      }
    };
  }, [categories]);

  // Scroll handlers
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (isLoading || !categories) {
    return (
      <section className="bg-white py-3 border-y border-neutral-200 sticky top-[133px] z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 animate-pulse bg-neutral-100 rounded-full"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-3 border-y border-neutral-200 sticky top-[133px] z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="relative flex-grow">
            {showLeftArrow && (
              <button 
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-neutral-400 hover:text-primary focus:outline-none transition-colors"
                aria-label="Scroll left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto hide-scrollbar pb-2 -mb-2 flex-grow"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setShowAll(true);
                    onSelectCategory(null);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap",
                    showAll 
                      ? "bg-primary text-white" 
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                  )}
                >
                  All News
                </button>
                
                {categories.map(category => (
                  <button 
                    key={category.id}
                    onClick={() => {
                      setShowAll(false);
                      onSelectCategory(category.slug);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap",
                      (!showAll && activeCategorySlug === category.slug)
                        ? "bg-primary text-white" 
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {showRightArrow && (
              <button 
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-neutral-400 hover:text-primary focus:outline-none transition-colors"
                aria-label="Scroll right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <button className="flex items-center justify-center px-3 py-2 bg-neutral-100 text-neutral-500 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-colors">
              <Filter className="h-4 w-4 mr-1" /> Filter
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
