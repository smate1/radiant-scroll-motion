
import React from "react";
import { Language, getTranslation } from "../lib/translations";
import FloatingElements from "./about/FloatingElements";
import AboutHeader from "./about/AboutHeader";
import AboutContent from "./about/AboutContent";
import AdvantagesCarousel from "./about/AdvantagesCarousel";

interface AboutSectionProps {
  className?: string;
  lang: Language;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  className = "",
  lang
}) => {
  return (
    <section id="about" className={`min-h-screen relative py-20 ${className}`}>
      <FloatingElements />
      <div className="container mx-auto px-4 relative z-10">
        <div className="connexi-gradient-text text-xl mb-6 reveal-on-scroll">
          {lang === 'en' ? '{01} ABOUT US' : '{01} ПРО НАС'}
        </div>
        
        <div className="max-w-5xl mx-auto mb-20">
          <AboutHeader lang={lang} className={className} />
          <AboutContent lang={lang} className={className} />
        </div>

        <AdvantagesCarousel lang={lang} className={className} />
      </div>
    </section>
  );
};

export default AboutSection;
