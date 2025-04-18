import * as React from "react";
import { cn } from "@/lib/utils";

interface TickerProps {
  className?: string;
  speed?: number; // in seconds
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  children: React.ReactNode;
}

export function Ticker({
  className,
  speed = 30,
  pauseOnHover = true,
  direction = "left",
  children,
}: TickerProps) {
  const [isHovering, setIsHovering] = React.useState(false);

  const transform = direction === "left" ? "translateX(-100%)" : "translateX(100%)";
  const animationName = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div
      className={cn("overflow-hidden whitespace-nowrap relative", className)}
      onMouseEnter={() => pauseOnHover && setIsHovering(true)}
      onMouseLeave={() => pauseOnHover && setIsHovering(false)}
    >
      <style jsx global>{`
        @keyframes ${animationName} {
          0% {
            transform: ${direction === "left" ? "translateX(100%)" : "translateX(-100%)"};
          }
          100% {
            transform: ${transform};
          }
        }
      `}</style>
      <div
        className="inline-block whitespace-nowrap"
        style={{
          animation: isHovering ? "none" : `${animationName} ${speed}s linear infinite`,
          paddingRight: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
