
import React from "react";
import { Button } from "@/components/ui/button";
import { Language } from "../../lib/translations";
import { useSimpleChatContext } from "../../contexts/SimpleChatContext";

interface AboutContentProps {
  lang: Language;
  className?: string;
}

const AboutContent: React.FC<AboutContentProps> = ({ lang, className }) => {
  const { openChat } = useSimpleChatContext();

  const handleContactClick = () => {
    openChat();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
      <div className="reveal-on-scroll" style={{ animationDelay: "0.1s" }}>
        <p className={`text-lg ${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}>
          <span className="font-bold connexi-gradient-text">CONNEXI.AI</span> 
          {lang === 'en' 
            ? ' — IS A TECHNOLOGY COMPANY THAT SPECIALIZES IN IMPLEMENTING ARTIFICIAL INTELLIGENCE IN CLIENT BUSINESS PROCESSES'
            : ' — ЦЕ ТЕХНОЛОГІЧНА КОМПАНІЯ, ЩО СПЕЦІАЛІЗУЄТЬСЯ НА ВПРОВАДЖЕННІ ШТУЧНОГО ІНТЕЛЕКТУ В БІЗНЕС-ПРОЦЕСИ КЛІЄНТІВ'
          }
        </p>
      </div>
      
      <div className="reveal-on-scroll" style={{ animationDelay: "0.2s" }}>
        <p className={`mb-8 ${className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}`}>
          {lang === 'en'
            ? 'We start with a deep study of your business, develop and program AI agents for your tasks, integrate them into your business processes and train them based on your company\'s unique content, ensuring maximum efficiency.'
            : 'Ми починаємо з глибокого вивчення вашого бізнесу, розробляємо та програмуємо AI-агентів під ваші задачі, інтегруємо їх у ваші бізнес-процеси та навчаємо на основі унікального контенту вашої компанії, забезпечуючи максимальну ефективність.'
          }
        </p>
        
        <Button 
          onClick={handleContactClick}
          className="contact-button px-6 py-2 rounded-full transition-all pulse-on-hover"
        >
          {lang === 'en' ? 'CONTACT US' : 'ЗВ\'ЯЗАТИСЯ'}
        </Button>
      </div>
    </div>
  );
};

export default AboutContent;
