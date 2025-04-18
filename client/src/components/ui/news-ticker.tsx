import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface NewsTickerProps {
  items: Array<{
    id: string | number;
    text: string;
    label?: string;
  }>;
  speed?: number;
  className?: string;
  pauseOnHover?: boolean;
  labelClassName?: string;
}

export const NewsTicker = ({
  items,
  speed = 20,
  className,
  pauseOnHover = true,
  labelClassName
}: NewsTickerProps) => {
  const [animationPlayState, setAnimationPlayState] = useState<'running' | 'paused'>('running');
  const tickerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (tickerRef.current) {
      const ticker = tickerRef.current;
      const updateContentWidth = () => {
        const contentElement = ticker.firstElementChild as HTMLElement;
        if (contentElement) {
          setContentWidth(contentElement.offsetWidth);
        }
      };

      // Initial measurement
      updateContentWidth();

      // Re-measure if window size changes
      const resizeObserver = new ResizeObserver(() => {
        updateContentWidth();
      });
      
      resizeObserver.observe(ticker);
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [items]);

  // Calculate animation duration based on content width and speed
  const duration = contentWidth / speed;

  if (!items.length) return null;

  return (
    <div 
      className={cn(
        "overflow-hidden whitespace-nowrap relative",
        className
      )}
      onMouseEnter={() => pauseOnHover && setAnimationPlayState('paused')}
      onMouseLeave={() => pauseOnHover && setAnimationPlayState('running')}
      ref={tickerRef}
    >
      <div 
        className="inline-block"
        style={{
          animationName: 'tickerAnimation',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: animationPlayState
        }}
      >
        {items.map((item) => (
          <span key={item.id} className="inline-flex items-center px-6">
            {item.label && (
              <span className={cn("text-xs px-2 py-0.5 mr-2 rounded-sm font-semibold", labelClassName)}>
                {item.label}
              </span>
            )}
            <span className="font-bold">{item.text}</span>
          </span>
        ))}
      </div>
      <div 
        className="inline-block"
        style={{
          animationName: 'tickerAnimation',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: animationPlayState,
          animationDelay: `${-duration / 2}s`
        }}
      >
        {items.map((item) => (
          <span key={item.id} className="inline-flex items-center px-6">
            {item.label && (
              <span className={cn("text-xs px-2 py-0.5 mr-2 rounded-sm font-semibold", labelClassName)}>
                {item.label}
              </span>
            )}
            <span className="font-bold">{item.text}</span>
          </span>
        ))}
      </div>

      <style jsx global>{`
        @keyframes tickerAnimation {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};
