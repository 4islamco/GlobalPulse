import { Play } from "lucide-react";

interface FeaturedVideoProps {
  className?: string;
}

export function FeaturedVideo({ className }: FeaturedVideoProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-['Playfair_Display'] font-bold mb-4">Featured Video</h3>
      <div className="relative rounded-lg overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80" 
          alt="News report video thumbnail" 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            className="w-16 h-16 bg-primary/80 hover:bg-primary rounded-full flex items-center justify-center text-white transition-colors" 
            aria-label="Play video"
          >
            <Play className="h-6 w-6 ml-1" />
          </button>
        </div>
      </div>
      <h4 className="font-medium mt-3">Special Report: Inside the Global Response to Climate Change</h4>
      <p className="text-neutral-medium text-sm mt-1">12:45 • June 20, 2024</p>
    </div>
  );
}
