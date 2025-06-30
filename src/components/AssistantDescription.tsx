
import React from "react";
import { Language, getTranslation } from "../lib/translations";

interface AssistantDescriptionProps {
  lang: Language;
}

const AssistantDescription: React.FC<AssistantDescriptionProps> = ({ lang }) => {
  return (
    <div className="reveal-on-scroll">
      <p className="text-lg text-white/80 mb-6">
        {getTranslation('assistantDescription1', lang)}
      </p>
      <p className="text-lg text-white/80 mb-6">
        {getTranslation('assistantDescription2', lang)}
      </p>
      <ul className="list-disc list-inside space-y-2 text-white/80 pl-4">
        <li>{getTranslation('assistantFeature1', lang)}</li>
        <li>{getTranslation('assistantFeature2', lang)}</li>
        <li>{getTranslation('assistantFeature3', lang)}</li>
        <li>{getTranslation('assistantFeature4', lang)}</li>
      </ul>
    </div>
  );
};

export default AssistantDescription;
