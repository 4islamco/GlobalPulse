import { useQuery } from "@tanstack/react-query";
import { TrendingTopic, LiveUpdate } from "@/lib/types";
import { useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  frequency: z.enum(["daily", "weekly", "monthly"])
});

const Sidebar = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      frequency: "weekly"
    }
  });

  // Trending topics query
  const { data: trendingTopics, isLoading: isLoadingTrending } = useQuery<TrendingTopic[]>({
    queryKey: ['/api/trending-topics'],
  });

  // Live updates query
  const { data: liveUpdates, isLoading: isLoadingUpdates } = useQuery<LiveUpdate[]>({
    queryKey: ['/api/live-updates'],
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }
      
      toast({
        title: "Subscription successful!",
        description: "You've been subscribed to our newsletter.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was a problem with your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <div className="lg:col-span-1 space-y-8">
      {/* Trending Now */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="text-lg font-bold font-sans mb-4 flex items-center">
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
            className="mr-2 text-primary"
          >
            <path d="M12 2v8"/>
            <path d="m16 6-4 4-4-4"/>
            <path d="M8 16H6a2 2 0 0 0-2 2"/>
            <path d="M4 18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/>
            <path d="M18 16h2a2 2 0 0 1 2 2"/>
            <path d="M8 16a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2"/>
          </svg>
          Trending Now
        </h3>
        <div className="space-y-4">
          {isLoadingTrending ? (
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex items-start">
                <Skeleton className="mr-3 h-6 w-6" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))
          ) : !trendingTopics || trendingTopics.length === 0 ? (
            <p className="text-gray-500 text-center py-2">No trending topics available</p>
          ) : (
            trendingTopics.map((topic, index) => (
              <div key={topic.id} className="flex items-start">
                <span className="font-bold text-gray-400 text-lg mr-3 font-mono">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <a href="#" className="text-gray-800 hover:text-primary transition-colors">
                  {topic.title}
                </a>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-br from-secondary to-secondary-700 rounded-lg shadow-sm p-5 text-white">
        <h3 className="text-lg font-bold font-sans mb-2">Stay Informed</h3>
        <p className="mb-4 text-sm">Get the latest news delivered directly to your inbox. No spam, just the stories that matter.</p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Your email address" 
                      {...field} 
                      className="w-full px-3 py-2 bg-white/10 placeholder-white/60 border border-white/25 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-white/90" />
                </FormItem>
              )}
            />
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem className="flex-shrink-0">
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/10 border-white/25 focus:ring-white/50 w-[110px]">
                          <SelectValue placeholder="Frequency" className="text-white" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 px-3 py-2 bg-white text-secondary-600 font-medium rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
            <p className="text-xs text-white/70">By subscribing, you agree to our Terms and Privacy Policy</p>
          </form>
        </Form>
      </div>
      
      {/* Live Updates */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-sans flex items-center">
            <span className="relative mr-2">
              <span className="absolute top-0 left-0 w-2.5 h-2.5 bg-primary rounded-full animate-ping opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            Live Updates
          </h3>
          <span className="text-xs text-gray-500">Auto-refreshing</span>
        </div>
        <div className="space-y-4">
          {isLoadingUpdates ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="border-l-2 border-gray-300 pl-3 py-1">
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))
          ) : !liveUpdates || liveUpdates.length === 0 ? (
            <p className="text-gray-500 text-center py-2">No live updates available</p>
          ) : (
            liveUpdates.map((update) => (
              <div 
                key={update.id} 
                className={`border-l-2 ${update.isRecent ? 'border-primary' : 'border-gray-300'} pl-3 py-1`}
              >
                <div className="text-xs text-gray-500 mb-1">{formatTimeAgo(update.createdAt)}</div>
                <p className="text-gray-800 text-sm">{update.content}</p>
              </div>
            ))
          )}
          <Link href="#">
            <span className="block text-center text-secondary hover:text-secondary/70 text-sm font-medium pt-2 cursor-pointer">
              See All Updates
            </span>
          </Link>
        </div>
      </div>
      
      {/* Video Report */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative h-48">
          <img 
            src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&h=400&q=80" 
            alt="News report from conflict zone" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
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
                className="text-white"
              >
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-3">
            <h4 className="text-white font-medium">Inside the Climate Crisis: Our Changing World</h4>
            <p className="text-white/80 text-xs">Special investigative report • 18:45</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
