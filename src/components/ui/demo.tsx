
import React from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import DisplayCards from "@/components/ui/display-cards";

export function BackgroundGradientAnimationDemo() {
  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex items-center justify-center text-white px-4 pointer-events-none">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2">
            <p className="text-3xl md:text-4xl lg:text-7xl font-bold text-transparent bg-clip-text drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
              Gradients X Animations
            </p>
          </div>
          
          <div className="lg:w-1/2 pointer-events-auto">
            <DisplayCards />
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
