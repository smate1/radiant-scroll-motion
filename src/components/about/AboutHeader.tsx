
import React from "react";
import { Language } from "../../lib/translations";

interface AboutHeaderProps {
  lang: Language;
  className?: string;
}

const AboutHeader: React.FC<AboutHeaderProps> = ({ lang, className }) => {
  return (
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center reveal-on-scroll">
      <span className={`${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}>
        {lang === 'en' ? 'WE IMPLEMENT ' : 'ВПРОВАДЖУЄМО '}
        <br />
        {lang === 'en' ? 'PROJECTS ' : 'ПРОЄКТИ '}
      </span>
      <span className="connexi-gradient-text">
        {lang === 'en' ? 'ARTIFICIAL' : 'ШТУЧНОГО'}
        <br />
        {lang === 'en' ? 'INTELLIGENCE' : 'ІНТЕЛЕКТУ'}
      </span>
    </h2>
  );
};

export default AboutHeader;
