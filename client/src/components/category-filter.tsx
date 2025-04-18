import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryFilterProps {
  onCategoryChange: (category: string | null) => void;
  activeCategory: string | null;
  className?: string;
}

export function CategoryFilter({ onCategoryChange, activeCategory, className }: CategoryFilterProps) {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  if (isLoading) {
    return (
      <div className={cn("mb-6 border-b border-neutral-light flex overflow-x-auto", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-20 mx-2" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("mb-6 border-b border-neutral-light flex overflow-x-auto hide-scrollbar", className)}>
      <button 
        className={cn(
          "px-4 py-2 text-sm font-['Roboto_Condensed'] font-medium transition-colors whitespace-nowrap",
          activeCategory === null 
            ? "text-primary border-b-2 border-primary" 
            : "text-neutral-medium hover:text-neutral-darkest"
        )}
        onClick={() => onCategoryChange(null)}
      >
        All
      </button>
      
      {categories?.map((category: any) => (
        <button 
          key={category.id}
          className={cn(
            "px-4 py-2 text-sm font-['Roboto_Condensed'] font-medium transition-colors whitespace-nowrap",
            activeCategory === category.slug 
              ? "text-primary border-b-2 border-primary" 
              : "text-neutral-medium hover:text-neutral-darkest"
          )}
          onClick={() => onCategoryChange(category.slug)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
