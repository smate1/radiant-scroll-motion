import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useSimpleChatContext } from "../contexts/SimpleChatContext";
import { Language, getTranslation } from "../lib/translations";

interface PartnersSectionProps {
  className?: string;
  lang: Language;
}

const partners = [
  { name: "OpenAI", id: 1 },
  { name: "Google Cloud", id: 2 },
  { name: "Microsoft Azure", id: 3 },
  { name: "Hugging Face", id: 4 },
  { name: "Amazon AWS", id: 5 },
  { name: "Anthropic", id: 6 },
  { name: "TensorFlow", id: 7 },
  { name: "PyTorch", id: 8 },
];

const PartnersSection: React.FC<PartnersSectionProps> = ({ className = "", lang }) => {
  const [carouselRef, carouselApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    dragFree: true,
    slidesToScroll: 1,
    skipSnaps: false
  });
  const { openChat } = useSimpleChatContext();
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  
  // Fixed auto scroll with proper ref handling
  useEffect(() => {
    if (carouselApi) {
      let autoScrollInterval: NodeJS.Timeout;
      
      const startAutoScroll = () => {
        autoScrollInterval = setInterval(() => {
          if (document.visibilityState === 'visible') {
            carouselApi.scrollNext();
          }
        }, 3000);
      };

      const stopAutoScroll = () => {
        if (autoScrollInterval) {
          clearInterval(autoScrollInterval);
        }
      };

      // Start auto scroll
      startAutoScroll();
      
      // Stop on hover (only for desktop) - using the carousel container element
      const carouselContainer = carouselContainerRef.current;
      if (carouselContainer && window.innerWidth > 768) {
        carouselContainer.addEventListener('mouseenter', stopAutoScroll);
        carouselContainer.addEventListener('mouseleave', startAutoScroll);
      }
      
      return () => {
        stopAutoScroll();
        if (carouselContainer && window.innerWidth > 768) {
          carouselContainer.removeEventListener('mouseenter', stopAutoScroll);
          carouselContainer.removeEventListener('mouseleave', startAutoScroll);
        }
      };
    }
  }, [carouselApi]);

  return (
    <section id="partners" className={`py-12 md:py-20 overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-12 md:mb-16 reveal-on-scroll">
          <div className="text-left mb-8">
            <div className="text-orange-500 text-lg md:text-xl mb-4 md:mb-6 font-semibold tracking-wide">
              {"{04}"} {lang === 'en' ? 'PARTNERS' : 'ПАРТНЕРИ'}
            </div>
          </div>
          <div className="text-center">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
              50 ТЕХНОЛОГІЙ
            </h2>
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
              З ЯКИМИ
            </h2>
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
              МИ
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="orange-highlight">ПРАЦЮЄМО</span>
            </h2>
          </div>
        </div>
      </div>
      
      {/* Improved mobile carousel */}
      <div ref={carouselContainerRef} className="w-full overflow-hidden mb-12 md:mb-16 reveal-on-scroll">
        <Carousel
          ref={carouselRef}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1,
            skipSnaps: false,
          }}
        >
          <CarouselContent className="py-4 -ml-2 md:-ml-4">
            {partners.map((partner) => (
              <CarouselItem key={partner.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-2 md:pl-4">
                <div className={`h-24 sm:h-28 md:h-32 lg:h-36 p-2 sm:p-3 md:p-4 lg:p-6 flex items-center justify-center rounded-lg shadow-sm border hover:shadow-md transition-all ${className?.includes('bg-gray-900') ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
                  <span className="text-xs sm:text-sm md:text-lg lg:text-xl font-semibold text-center break-words leading-tight display-block w-full max-w-full overflow-hidden">
                    {partner.name}
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center reveal-on-scroll">
          <Button 
            onClick={openChat}
            className="contact-button flex items-center gap-2 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-full"
          >
            {getTranslation('ourCases', lang)}
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>
      
      {/* Background elements with better mobile optimization */}
      <div className="floating-element w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 top-20 -left-16 md:-left-32 lg:-left-48 opacity-10 md:opacity-20"></div>
      <div className="floating-element w-24 h-24 md:w-48 md:h-48 lg:w-80 lg:h-80 bottom-10 -right-12 md:-right-24 lg:-right-40 opacity-10 md:opacity-20"></div>
    </section>
  );
};

export default PartnersSection;
