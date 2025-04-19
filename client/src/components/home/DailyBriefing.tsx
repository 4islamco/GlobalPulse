import { useQuery } from "@tanstack/react-query";
import { DailyBriefingItem } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const DailyBriefing = () => {
  const { data: briefingItems, isLoading, error } = useQuery<DailyBriefingItem[]>({
    queryKey: ['/api/daily-briefing'],
  });

  if (isLoading) {
    return (
      <section className="mb-12 bg-gray-900 text-white rounded-xl overflow-hidden">
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <Skeleton className="w-10 h-10 rounded-full bg-gray-800 mr-3" />
              <Skeleton className="h-7 w-48 bg-gray-800" />
            </div>
            <Skeleton className="h-4 w-full bg-gray-800 mb-2" />
            <Skeleton className="h-4 w-3/4 bg-gray-800 mb-6" />
            
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <Skeleton className="h-6 w-40 bg-gray-700 mb-3" />
              <div className="space-y-2">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full bg-gray-700" />
                ))}
              </div>
            </div>
            
            <Skeleton className="h-10 w-48 bg-gray-800" />
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !briefingItems || briefingItems.length === 0) {
    return null; // Don't display if there's an error or no items
  }

  return (
    <section className="mb-12 bg-gray-900 text-white rounded-xl overflow-hidden">
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <motion.div 
            className="flex items-center mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
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
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                <path d="M18 14h-8"/>
                <path d="M15 18h-5"/>
                <path d="M10 6h8v4h-8V6Z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-sans">The Daily Briefing</h2>
          </motion.div>
          <motion.p 
            className="text-gray-300 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Start your morning with a concise summary of the most important stories, curated by our editorial team.
          </motion.p>
          
          <motion.div 
            className="bg-gray-800 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3 className="font-medium mb-2 text-lg">Today's Highlights</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
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
                  className="text-green-400 mr-2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <path d="m9 11 3 3L22 4"/>
                </svg>
                <span>Global economic outlook</span>
              </li>
              <li className="flex items-center">
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
                  className="text-green-400 mr-2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <path d="m9 11 3 3L22 4"/>
                </svg>
                <span>Major policy announcements</span>
              </li>
              <li className="flex items-center">
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
                  className="text-green-400 mr-2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <path d="m9 11 3 3L22 4"/>
                </svg>
                <span>Breaking developments</span>
              </li>
              <li className="flex items-center">
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
                  className="text-green-400 mr-2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <path d="m9 11 3 3L22 4"/>
                </svg>
                <span>Key events to watch</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.a 
            href="#" 
            className="inline-flex items-center px-4 py-2 border border-white rounded-md hover:bg-white hover:text-gray-900 transition-colors font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Subscribe to Daily Briefing
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
          </motion.a>
        </div>
        
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {briefingItems.map((item, index) => (
            <motion.div 
              key={item.id} 
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
            >
              <span className="text-xs font-medium text-gray-400 mb-1 block">{item.category}</span>
              <h3 className={`font-bold text-base mb-2 font-sans ${item.color} pl-2`}>{item.title}</h3>
              <p className="text-gray-300 text-sm line-clamp-3">{item.summary}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DailyBriefing;
