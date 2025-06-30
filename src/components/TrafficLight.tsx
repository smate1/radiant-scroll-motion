
import React from 'react';
import { cn } from '@/lib/utils';

interface TrafficLightProps {
  isActive: boolean;
  className?: string;
  onClick?: () => void;
}

export const TrafficLight: React.FC<TrafficLightProps> = ({ isActive, className, onClick }) => {
  return (
    <div 
      className={cn("flex items-center gap-1", className)} 
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-center gap-0.5">
        <div 
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            isActive 
              ? "bg-red-500 shadow-lg shadow-red-500/50 animate-pulse" 
              : "bg-red-300"
          )}
        />
        <div 
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            isActive 
              ? "bg-yellow-500 shadow-lg shadow-yellow-500/50 animate-pulse" 
              : "bg-yellow-300"
          )}
          style={{ animationDelay: '0.1s' }}
        />
        <div 
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            isActive 
              ? "bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" 
              : "bg-green-300"
          )}
          style={{ animationDelay: '0.2s' }}
        />
      </div>
    </div>
  );
};
