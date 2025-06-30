
import React from "react";
import { MovingBorder } from "@/components/ui/moving-border";
import { Button } from "@/components/ui/button";
import { useSimpleChatContext } from "../contexts/SimpleChatContext";
import { Language, getTranslation } from "../lib/translations";

interface ServicesSectionProps {
  className?: string;
  lang: Language;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ className = "", lang }) => {
  const { openChat } = useSimpleChatContext();
  
  const services = [
    {
      id: "01",
      titleKey: 'service1Title' as const,
      descriptionKey: 'service1Description' as const,
    },
    {
      id: "02", 
      titleKey: 'service2Title' as const,
      descriptionKey: 'service2Description' as const,
    },
    {
      id: "03",
      titleKey: 'service3Title' as const,
      descriptionKey: 'service3Description' as const,
    }
  ];

  return (
    <section id="services" className={`min-h-screen relative py-20 ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-orange-500 text-xl mb-6 reveal-on-scroll">{getTranslation('servicesSubtitle', lang)}</div>
        
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center reveal-on-scroll">
            <span className="text-gray-800">{getTranslation('servicesTitle1', lang)} </span>
            <span className="connexi-gradient-text">{getTranslation('servicesTitle2', lang)}<br />{getTranslation('servicesTitle3', lang)}</span>
          </h2>

          <div className="space-y-12 mt-16">
            {services.map((service) => (
              <div key={service.id} className="reveal-on-scroll">
                <div className="relative p-[1px] rounded-md overflow-hidden">
                  <MovingBorder duration={3000} rx="0.5rem" ry="0.5rem">
                    <div className="h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--connexi-orange)_40%,var(--connexi-pink)_60%,transparent_85%)]" />
                  </MovingBorder>
                
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-md p-6 z-10 border-l-4 border-connexi-orange">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-gray-400">{ `{ ${service.id} }` }</div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/2">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                          {getTranslation(service.titleKey, lang)}
                        </h3>
                      </div>
                      <div className="md:w-1/2">
                        <p className="text-gray-700">{getTranslation(service.descriptionKey, lang)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button 
              className="contact-button px-10 py-6 rounded-full transition-all pulse-on-hover font-semibold text-lg"
              onClick={openChat}
            >
              {lang === 'en' ? 'Our Services' : 'Наші послуги'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
