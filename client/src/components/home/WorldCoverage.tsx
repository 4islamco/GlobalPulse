import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Region, RegionNews } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const WorldCoverage = () => {
  const [activeRegion, setActiveRegion] = useState<number | null>(null);
  const [displayedRegions, setDisplayedRegions] = useState<number[]>([]);

  // Fetch all regions
  const { data: regions, isLoading: isLoadingRegions } = useQuery<Region[]>({
    queryKey: ['/api/regions'],
    onSuccess: (data) => {
      if (data && data.length > 0 && !activeRegion) {
        // If we don't have an active region yet, set it to the first one returned
        setActiveRegion(0);
        
        // Set the displayed regions (if we have 3 or more regions)
        if (data.length >= 3) {
          setDisplayedRegions([0, 1, 2]);
        } else {
          setDisplayedRegions(data.map((_, i) => i));
        }
      }
    },
  });

  // Fetch region news for each displayed region
  const regionNewsQueries = displayedRegions.map(index => {
    const region = regions?.[index];
    return useQuery<RegionNews[]>({
      queryKey: ['/api/regions', region?.id, 'news'],
      queryFn: async () => {
        if (!region) return [];
        const response = await fetch(`/api/regions/${region.id}/news`);
        if (!response.ok) throw new Error("Failed to fetch region news");
        return await response.json();
      },
      enabled: !!region,
    });
  });
  
  const handleRegionClick = (index: number) => {
    setActiveRegion(index);
    
    // If we have more than 3 regions, we'll display the active one plus two others
    if (regions && regions.length > 3) {
      let newDisplayed = [index];
      
      // Add up to 2 more regions after the selected one
      for (let i = 1; i <= 2; i++) {
        const nextIndex = (index + i) % regions.length;
        if (!newDisplayed.includes(nextIndex)) {
          newDisplayed.push(nextIndex);
        }
      }
      
      // If we still don't have 3 regions, add from the beginning
      let i = 0;
      while (newDisplayed.length < 3 && i < regions.length) {
        if (!newDisplayed.includes(i)) {
          newDisplayed.push(i);
        }
        i++;
      }
      
      setDisplayedRegions(newDisplayed);
    }
  };
  
  const handlePrev = () => {
    if (!regions || regions.length === 0) return;
    
    const newActive = activeRegion !== null
      ? (activeRegion - 1 + regions.length) % regions.length
      : 0;
      
    handleRegionClick(newActive);
  };
  
  const handleNext = () => {
    if (!regions || regions.length === 0) return;
    
    const newActive = activeRegion !== null
      ? (activeRegion + 1) % regions.length
      : 0;
      
    handleRegionClick(newActive);
  };

  if (isLoadingRegions) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48 bg-card" />
          <div className="flex space-x-3">
            <Skeleton className="w-8 h-8 rounded-full bg-card" />
            <Skeleton className="w-8 h-8 rounded-full bg-card" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md bg-card" />
          ))}
        </div>
        
        <Skeleton className="h-80 w-full rounded-xl bg-card" />
      </section>
    );
  }

  if (!regions || regions.length === 0) {
    return null; // Don't display the section if no regions are available
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-sans flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2 gradient-text"
          >
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
            <path d="M2 12h20"/>
          </svg>
          <span className="gradient-text">World Coverage</span>
        </h2>
        <div className="flex space-x-3">
          <button 
            className="w-8 h-8 rounded-full bg-card hover:bg-muted flex items-center justify-center text-foreground"
            onClick={handlePrev}
            aria-label="Previous region"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
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
            className="w-8 h-8 rounded-full bg-card hover:bg-muted flex items-center justify-center text-foreground"
            onClick={handleNext}
            aria-label="Next region"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
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
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <button 
          className="px-4 py-2 gradient-blueberry-red text-white rounded-md font-medium text-sm"
          onClick={() => setActiveRegion(null)}
        >
          All Regions
        </button>
        {regions.map((region, index) => (
          <button
            key={region.id}
            className={`px-4 py-2 ${
              activeRegion === index 
                ? "gradient-red-blueberry text-white" 
                : "bg-card hover:bg-muted text-foreground"
            } rounded-md font-medium text-sm transition-colors`}
            onClick={() => handleRegionClick(index)}
          >
            {region.name}
          </button>
        ))}
      </div>
      
      <div className="relative bg-card rounded-xl shadow-md overflow-hidden border border-muted">
        <div className="absolute inset-0 z-0 bg-background/50">
          {/* World map visualization - in a real app this would be an SVG map */}
          <div className="w-full h-full opacity-20 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-foreground"
            >
              <path d="M20 7h-7.667a1.98 1.98 0 0 0-1.414.586l-8.262 8.262a2 2 0 0 0 0 2.828l2.828 2.828a2 2 0 0 0 2.828 0l8.262-8.262A1.98 1.98 0 0 0 17.161 12V4.333a2 2 0 0 0 2-2V2a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v.333a2 2 0 0 0 2 2V7Z"/>
              <path d="m6 18 8-8"/>
            </svg>
          </div>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {displayedRegions.map((regionIndex, index) => {
            const region = regions[regionIndex];
            const { data: regionNews, isLoading } = regionNewsQueries[index] || { data: [], isLoading: true };
            
            return (
              <motion.div
                key={region.id}
                className="bg-card/90 backdrop-blur-sm rounded-lg border border-muted p-4 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-3">
                  <span className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-secondary' : 'gradient-blueberry-red'} mr-2`}></span>
                  <h3 className="font-bold text-base gradient-text">{region.name}</h3>
                </div>
                {isLoading ? (
                  <ul className="space-y-3">
                    {Array(3).fill(0).map((_, i) => (
                      <li key={i}>
                        <Skeleton className="h-4 w-full bg-muted" />
                      </li>
                    ))}
                  </ul>
                ) : !regionNews || regionNews.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No news available for this region</p>
                ) : (
                  <ul className="space-y-3">
                    {regionNews.map(news => (
                      <li key={news.id}>
                        <button className="flex items-start hover:text-primary transition-all hover:translate-x-1 text-left w-full">
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
                            className="text-muted-foreground mt-1 mr-2"
                          >
                            <path d="m9 18 6-6-6-6"/>
                          </svg>
                          <span className="text-sm">{news.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorldCoverage;
