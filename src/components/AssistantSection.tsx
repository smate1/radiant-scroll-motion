
import React from "react";
import { Language, getTranslation } from "../lib/translations";
import AssistantDescription from "./AssistantDescription";
import { Button } from "@/components/ui/button";
import { useSimpleChatContext } from "@/contexts/SimpleChatContext";

interface AssistantSectionProps {
  className?: string;
  lang: Language;
}

const AssistantSection: React.FC<AssistantSectionProps> = ({ className = "", lang }) => {
  const { openChat } = useSimpleChatContext();

  return (
    <section id="assistant" className={`min-h-screen py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-orange-500 text-xl mb-6 reveal-on-scroll">
          {getTranslation('assistantSubtitle', lang)}
        </div>
        
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center reveal-on-scroll">
            <span className="text-white">{getTranslation('assistantTitle1', lang)} </span>
            <span className="connexi-gradient-text">{getTranslation('assistantTitle2', lang)}</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AssistantDescription lang={lang} />
            
            <div className="flex flex-col items-center justify-center space-y-8 reveal-on-scroll">
              <div className="text-center">
                <img
                  src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/public/media-bucket-test/ezgif-8981affd404761.webp"
                  alt="AI Assistant"
                  className="h-32 w-32 mx-auto mb-6 rounded-full opacity-90"
                />
                <p className="text-lg text-white/80 mb-8">
                  {lang === 'en' 
                    ? "Ready to answer your questions about AI solutions for your business"
                    : "Готовий відповісти на ваші запитання про AI-рішення для вашого бізнесу"
                  }
                </p>
              </div>
              
              <Button 
                onClick={openChat}
                size="lg"
                className="contact-button text-lg px-8 py-4 h-auto"
              >
                {lang === 'en' ? 'Start Chat' : 'Почати чат'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssistantSection;
