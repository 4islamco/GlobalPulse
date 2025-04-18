import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

export function LoadingIndicator({ message = "Loading...", size = "medium" }: LoadingIndicatorProps) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12"
  };
  
  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg"
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      {message && <p className={`mt-2 text-neutral-dark ${textSizes[size]}`}>{message}</p>}
    </div>
  );
}
