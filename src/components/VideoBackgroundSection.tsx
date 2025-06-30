
import React from "react";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Language, getTranslation } from "../lib/translations";
import { useSimpleChatContext } from "../contexts/SimpleChatContext";

interface VideoBackgroundSectionProps {
  lang: Language;
}

const VideoBackgroundSection: React.FC<VideoBackgroundSectionProps> = ({ lang }) => {
  const { openChat } = useSimpleChatContext();

  const handleLearnMoreClick = () => {
    openChat();
  };

  return (
    <section className="relative min-h-screen py-20 flex items-center video-background-section overflow-hidden animated-bg-light">
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6 reveal-on-scroll">
            <TextShimmer 
              className="font-semibold [--base-color:theme(colors.connexi.orange)] [--base-gradient-color:theme(colors.connexi.pink)]" 
              duration={1.5}
              spread={3}
            >
              {getTranslation('videoSubtitle', lang)}
            </TextShimmer>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 reveal-on-scroll">
            <span className="text-gray-800">{getTranslation('videoTitle1', lang)} </span>
            <span className="connexi-gradient-text font-extrabold">{getTranslation('videoTitle2', lang)}</span>
            <span className="text-gray-800">{getTranslation('videoTitle3', lang)}</span>
          </h2>

          <div className="max-w-3xl mx-auto mb-16 reveal-on-scroll">
            <p className="text-gray-700 text-lg mb-8">
              {getTranslation('videoDescription', lang)}
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button 
                className="contact-button px-10 py-6 rounded-full transition-all pulse-on-hover font-semibold"
                onClick={handleLearnMoreClick}
              >
                {getTranslation('learnMore', lang)}
              </Button>
              
              <img
                src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/public/media-bucket-test/ezgif-8981affd404761.webp"
                alt="AI Animation"
                className="h-[60px] w-auto rounded-lg opacity-80 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoBackgroundSection;
