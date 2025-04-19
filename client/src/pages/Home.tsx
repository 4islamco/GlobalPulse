import { useEffect } from "react";
import HeroCarousel from "@/components/home/HeroCarousel";
import TopStories from "@/components/home/TopStories";
import FeaturedReport from "@/components/home/FeaturedReport";
import LatestNews from "@/components/home/LatestNews";
import Sidebar from "@/components/home/Sidebar";
import EditorsPicks from "@/components/home/EditorsPicks";
import WorldCoverage from "@/components/home/WorldCoverage";
import DailyBriefing from "@/components/home/DailyBriefing";

const Home = () => {
  // Set page title
  useEffect(() => {
    document.title = "REAL WORLD - Global News Platform";
  }, []);

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />
      
      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Stories */}
        <TopStories />
        
        {/* Featured Report */}
        <FeaturedReport />
        
        {/* Two column layout - Latest News and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <LatestNews />
          <Sidebar />
        </div>
        
        {/* Editor's Picks */}
        <EditorsPicks />
        
        {/* World Coverage */}
        <WorldCoverage />
        
        {/* Daily Briefing */}
        <DailyBriefing />
      </div>
    </>
  );
};

export default Home;
