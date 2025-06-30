import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import DisplayCards from "@/components/ui/display-cards";
import { useSimpleChatContext } from "../contexts/SimpleChatContext";
import { Language, getTranslation } from "../lib/translations";

interface HeroSectionProps {
  lang: Language;
}

const HeroSection: React.FC<HeroSectionProps> = ({ lang }) => {
  const { openChat } = useSimpleChatContext();

  useEffect(() => {
    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const parallaxElements = document.querySelectorAll('.parallax');
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      parallaxElements.forEach((element: Element) => {
        const speed = parseFloat((element as HTMLElement).dataset.speed || '0.05');
        const x = (mouseX - windowWidth / 2) * speed;
        const y = (mouseY - windowHeight / 2) * speed;
        
        (element as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    // Enhanced floating elements animation with geometric diamonds
    const createFloatingElements = () => {
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return;

      // Remove existing floating elements
      const existingElements = heroSection.querySelectorAll('.hero-floating-element, .hero-dynamic-blob, .hero-wave-element, .hero-geometric-diamond');
      existingElements.forEach(el => el.remove());

      // Create geometric diamond elements (like in the uploaded image)
      for (let i = 0; i < 6; i++) {
        const diamond = document.createElement('div');
        diamond.className = 'hero-geometric-diamond';
        
        const size = Math.random() * 80 + 60;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 10;
        const rotation = Math.random() * 360;
        
        diamond.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}%;
          top: ${y}%;
          z-index: 1;
          pointer-events: none;
          animation: geometricFloat ${duration}s ease-in-out infinite, geometricRotate ${duration * 1.5}s linear infinite;
          animation-delay: ${delay}s, ${delay + 2}s;
          will-change: transform;
          transform: rotate(${rotation}deg);
        `;
        
        // Create the diamond shape with gradients
        diamond.innerHTML = `
          <div style="
            width: 100%;
            height: 100%;
            position: relative;
            transform: rotate(45deg);
          ">
            <div style="
              position: absolute;
              width: 50%;
              height: 50%;
              background: linear-gradient(135deg, rgba(8,50,162,0.15) 0%, rgba(151,71,255,0.1) 100%);
              top: 0;
              left: 0;
              clip-path: polygon(0 0, 100% 0, 0 100%);
            "></div>
            <div style="
              position: absolute;
              width: 50%;
              height: 50%;
              background: linear-gradient(135deg, rgba(255,122,0,0.15) 0%, rgba(255,54,163,0.1) 100%);
              top: 0;
              right: 0;
              clip-path: polygon(0 0, 100% 0, 100% 100%);
            "></div>
            <div style="
              position: absolute;
              width: 50%;
              height: 50%;
              background: linear-gradient(135deg, rgba(255,54,163,0.15) 0%, rgba(151,71,255,0.1) 100%);
              bottom: 0;
              left: 0;
              clip-path: polygon(0 0, 0 100%, 100% 100%);
            "></div>
            <div style="
              position: absolute;
              width: 50%;
              height: 50%;
              background: linear-gradient(135deg, rgba(151,71,255,0.15) 0%, rgba(8,50,162,0.1) 100%);
              bottom: 0;
              right: 0;
              clip-path: polygon(100% 0, 0 100%, 100% 100%);
            "></div>
          </div>
        `;
        
        heroSection.appendChild(diamond);
      }

      // Create floating circles with reduced count
      for (let i = 0; i < 3; i++) {
        const element = document.createElement('div');
        element.className = 'hero-floating-element';
        
        const size = Math.random() * 100 + 60;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 15 + 20;
        const delay = Math.random() * 8;
        
        element.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,122,0,0.04) 0%, rgba(255,54,163,0.03) 50%, rgba(151,71,255,0.02) 100%);
          left: ${x}%;
          top: ${y}%;
          z-index: 1;
          pointer-events: none;
          animation: heroFloat ${duration}s ease-in-out infinite;
          animation-delay: ${delay}s;
          will-change: transform;
        `;
        
        heroSection.appendChild(element);
      }

      // Create morphing blobs with reduced count
      for (let i = 0; i < 2; i++) {
        const blob = document.createElement('div');
        blob.className = 'hero-dynamic-blob';
        
        const size = Math.random() * 120 + 80;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 25;
        const delay = Math.random() * 10;
        
        blob.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: linear-gradient(45deg, rgba(255,122,0,0.02) 0%, rgba(255,54,163,0.03) 50%, rgba(151,71,255,0.02) 100%);
          left: ${x}%;
          top: ${y}%;
          z-index: 1;
          pointer-events: none;
          animation: morphBlob ${duration}s ease-in-out infinite, pulseGlow ${duration * 0.7}s ease-in-out infinite;
          animation-delay: ${delay}s, ${delay + 2}s;
          will-change: transform, border-radius;
          filter: blur(1px);
        `;
        
        heroSection.appendChild(blob);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    createFloatingElements();
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-screen pt-20 flex items-center bg-white hero-section overflow-hidden">
      {/* YouTube Video Background */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        {/* Slightly more transparent overlay to show more background dynamics */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/60 to-white/60 z-10"></div>
        <div className="relative w-full h-full">
          <iframe
            src="https://www.youtube.com/embed/Jox6R5-rIH0?autoplay=1&mute=1&loop=1&playlist=Jox6R5-rIH0&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
            title="Blueprint Background Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh]"
            style={{ mixBlendMode: 'normal' }}
          ></iframe>
        </div>
      </div>
      
      <div className="animated-bg-light absolute inset-0 z-5"></div>
      
      <div className="container mx-auto px-4 relative z-10 w-full max-w-full overflow-hidden">
        <div className="py-12 md:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto w-full">
            <div className="reveal-on-scroll">
              <div className="mb-6">
                <TextShimmer 
                  className="font-semibold [--base-color:theme(colors.connexi.orange)] [--base-gradient-color:theme(colors.connexi.pink)]" 
                  duration={1.5}
                  spread={3}
                >
                  {getTranslation('heroSubtitle', lang)}
                </TextShimmer>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900" style={{ animationDelay: "0.1s" }}>
                <span className="text-gray-800">{getTranslation('heroTitle1', lang)} </span>
                <br />
                <span className="connexi-gradient-text font-extrabold parallax" data-speed="0.02">{getTranslation('heroTitle2', lang)}</span>
                <span className="text-gray-800">{getTranslation('heroTitle3', lang)}</span>
              </h1>

              <div className="max-w-2xl" style={{ animationDelay: "0.2s" }}>
                <p className="text-gray-700 mb-8">
                  {getTranslation('heroDescription', lang)}
                  <span className="connexi-gradient-text font-medium">{getTranslation('heroDescriptionHighlight', lang)}</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="contact-button px-10 py-6 rounded-full transition-all pulse-on-hover font-semibold"
                    onClick={openChat}
                  >
                    {getTranslation('ourServices', lang)}
                  </Button>
                </div>
              </div>
            </div>

            <div className="hidden lg:block reveal-on-scroll">
              <DisplayCards />
            </div>
          </div>

          <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="reveal-on-scroll parallax" data-speed="0.03" style={{ animationDelay: "0.3s" }}>
              <div className="connexi-gradient-text font-medium mb-3">{getTranslation('certifiedSpecialists', lang)}</div>
            </div>
            <div className="text-right reveal-on-scroll parallax" data-speed="0.01" style={{ animationDelay: "0.4s" }}>
              <div className="text-gray-700 mb-3">{getTranslation('chatbotsDescription', lang)}</div>
              <div className="text-gray-700">{getTranslation('automationDescription', lang)}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <a href="#about" className="text-gray-600 opacity-60 hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
