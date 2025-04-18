import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageSliderProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  containerClassName?: string;
  showArrows?: boolean;
  showDots?: boolean;
}

export const ImageSlider = ({
  images,
  autoPlay = true,
  autoPlayInterval = 5000,
  className,
  containerClassName,
  showArrows = true,
  showDots = true,
}: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const goToNextSlide = () => {
    const newIndex = (currentIndex + 1) % images.length;
    goToSlide(newIndex);
  };

  const goToPrevSlide = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    goToSlide(newIndex);
  };

  useEffect(() => {
    if (autoPlay) {
      const startAutoPlay = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          goToNextSlide();
        }, autoPlayInterval);
      };

      startAutoPlay();
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [currentIndex, autoPlay, autoPlayInterval]);

  if (!images.length) return null;

  return (
    <div className={cn("relative overflow-hidden rounded-xl", containerClassName)}>
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 ease-in-out",
          className
        )}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Navigation arrows */}
        {showArrows && images.length > 1 && (
          <>
            <button
              onClick={goToPrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 shadow-lg flex items-center justify-center text-neutral-500 hover:text-primary focus:outline-none transition-colors"
              disabled={isTransitioning}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 shadow-lg flex items-center justify-center text-neutral-500 hover:text-primary focus:outline-none transition-colors"
              disabled={isTransitioning}
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {showDots && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300 focus:outline-none",
                  index === currentIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
