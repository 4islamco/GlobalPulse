import { useQuery } from "@tanstack/react-query";
import { Ticker } from "@/components/ui/ticker";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsTicker() {
  const { data: breakingNews, isLoading } = useQuery({
    queryKey: ['/api/breaking-news'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex items-center">
          <div className="bg-primary-dark text-white px-3 py-1 font-['Roboto_Condensed'] font-bold tracking-wide mr-4 flex-shrink-0">
            BREAKING
          </div>
          <Skeleton className="h-6 w-full bg-primary-light/20" />
        </div>
      </div>
    );
  }

  if (!breakingNews || breakingNews.length === 0) {
    return null;
  }

  return (
    <div className="bg-primary text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4 flex items-center">
        <div className="bg-primary-dark text-white px-3 py-1 font-['Roboto_Condensed'] font-bold tracking-wide mr-4 flex-shrink-0">
          BREAKING
        </div>
        <Ticker className="flex-1" speed={30} pauseOnHover={true} direction="left">
          {breakingNews.map((item: any, index: number) => (
            <span key={item.id} className="mr-8 font-medium">{item.text}</span>
          ))}
        </Ticker>
      </div>
    </div>
  );
}
