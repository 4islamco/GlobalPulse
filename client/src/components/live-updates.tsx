import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Update {
  id: number;
  time: string;
  type: "breaking" | "update";
  title: string;
  content: string;
}

interface LiveUpdatesProps {
  className?: string;
}

// Sample data - in a real app this would come from the API
const liveUpdates: Update[] = [
  {
    id: 1,
    time: "2 minutes ago",
    type: "breaking",
    title: "Global Stock Markets React to Central Bank Interest Rate Decision",
    content: "Financial markets worldwide are responding to the unexpected decision by central banks to hold interest rates steady despite inflation concerns."
  },
  {
    id: 2,
    time: "15 minutes ago",
    type: "update",
    title: "Tech Conference Showcases Next Generation of AI Innovations",
    content: "Industry leaders are presenting cutting-edge AI technologies at the annual tech conference, with demonstrations of applications across healthcare, transportation, and education."
  },
  {
    id: 3,
    time: "42 minutes ago",
    type: "update",
    title: "Space Agency Provides Update on Mars Mission Progress",
    content: "Scientists report significant milestones in the ongoing Mars exploration mission, with new data being transmitted from the rover currently operating on the planet's surface."
  }
];

export function LiveUpdates({ className }: LiveUpdatesProps) {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.section 
      className={`mt-12 mb-12 ${className}`}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ delay: 0.3 }}
    >
      <div className="bg-secondary/10 rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-secondary mb-2 md:mb-0">Live Updates</h2>
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium">Updates automatically refresh</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {liveUpdates.map(update => (
            <div 
              key={update.id} 
              className={`border-l-4 ${update.type === 'breaking' ? 'border-secondary' : 'border-neutral-light'} pl-4 pb-4`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-medium ${update.type === 'breaking' ? 'text-secondary' : 'text-neutral-medium'}`}>
                  {update.time}
                </span>
                <span 
                  className={`px-2 py-1 text-xs uppercase font-['Roboto_Condensed'] tracking-wider rounded-sm ${update.type === 'breaking' ? 'bg-secondary/20 text-secondary' : 'bg-neutral-lighter text-neutral-dark'}`}
                >
                  {update.type === 'breaking' ? 'Breaking' : 'Update'}
                </span>
              </div>
              <h3 className="font-medium mb-1">{update.title}</h3>
              <p className="text-neutral-dark text-sm">{update.content}</p>
            </div>
          ))}
        </div>
        
        <Button className="w-full mt-6 bg-white hover:bg-neutral-lightest text-secondary font-medium py-2 rounded-md transition-colors border border-secondary/20">
          View All Updates
        </Button>
      </div>
    </motion.section>
  );
}
