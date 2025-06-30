
import React, { useEffect, memo } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import VideoBackgroundSection from "../components/VideoBackgroundSection";
import AssistantSection from "../components/AssistantSection";
import ServicesSection from "../components/ServicesSection";
import PartnersSection from "../components/PartnersSection";
import CasesSection from "../components/CasesSection";
import ContactsSection from "../components/ContactsSection";
import ScrollAnimation from "../components/ScrollAnimation";
import { SimpleChatButton } from "../components/SimpleChatButton";
import { SimpleChat } from "../components/SimpleChat";
import { SimpleChatProvider } from "../contexts/SimpleChatContext";
import { Language } from "../lib/translations";

interface IndexProps {
  lang: Language;
}

const Index: React.FC<IndexProps> = memo(({ lang = 'uk' }) => {
  useEffect(() => {
    try {
      const title = lang === 'en' 
        ? "connexi.ai | AI solutions for business in Ukraine"
        : "connexi.ai | AI-рішення для бізнесу в Україні";
      document.title = title;
    } catch (error) {
      console.error('Error setting page title:', error);
    }
  }, [lang]);

  try {
    return (
      <SimpleChatProvider>
        <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden w-full">
          <ScrollAnimation />
          <Navbar lang={lang} />
          <HeroSection lang={lang} />
          <AboutSection className="bg-gray-900 text-white" lang={lang} />
          <VideoBackgroundSection lang={lang} />
          <AssistantSection className="bg-gray-900 text-white" lang={lang} />
          <ServicesSection className="bg-white text-gray-900" lang={lang} />
          <PartnersSection className="bg-gray-900 text-white" lang={lang} />
          <CasesSection className="bg-white text-gray-900" lang={lang} />
          <ContactsSection className="bg-gray-900 text-white" lang={lang} />
          
          <SimpleChatButton lang={lang} />
          <SimpleChat lang={lang} />
        </div>
      </SimpleChatProvider>
    );
  } catch (error) {
    console.error('Error rendering Index component:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        Error loading page. Check console for details.
      </div>
    );
  }
});

Index.displayName = 'Index';

export default Index;
