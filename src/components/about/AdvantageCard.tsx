
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Language } from "../../lib/translations";

interface AdvantageCardProps {
  title: string;
  content: string;
  highlight?: string;
  className?: string;
  animationDelay: string;
  lang: Language;
}

const AdvantageCard: React.FC<AdvantageCardProps> = ({
  title,
  content,
  highlight,
  className,
  animationDelay,
  lang
}) => {
  const renderContentWithHighlight = () => {
    if (!highlight) {
      return content;
    }

    const parts = content.split(highlight);
    const result = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        result.push(
          <span key={`highlight-${i}`} className="connexi-gradient-text">
            {highlight}
          </span>
        );
      }
      result.push(parts[i]);
    }
    
    return result;
  };

  return (
    <Card 
      className={`shadow-sm border rounded-lg p-4 reveal-on-scroll h-full card-hover ${
        className?.includes('bg-gray-900') 
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-200'
      }`} 
      style={{ animationDelay }}
    >
      <CardContent className="p-4 md:p-6">
        <h3 className={`text-xl md:text-2xl mb-6 md:mb-8 ${
          className?.includes('text-white') ? 'text-white' : 'text-gray-800'
        }`}>
          {title}
        </h3>
        <div className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}>
          <p className="mb-4 text-sm md:text-base">
            {renderContentWithHighlight()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvantageCard;
