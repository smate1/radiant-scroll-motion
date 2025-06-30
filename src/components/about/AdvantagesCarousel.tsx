
import React from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Language } from "../../lib/translations";
import AdvantageCard from "./AdvantageCard";

interface AdvantagesCarouselProps {
  lang: Language;
  className?: string;
}

const AdvantagesCarousel: React.FC<AdvantagesCarouselProps> = ({ lang, className }) => {
  const [api, setApi] = React.useState<CarouselApi>();

  const scrollPrev = React.useCallback(() => {
    if (api) {
      api.scrollPrev();
    }
  }, [api]);

  const scrollNext = React.useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  const advantages = [
    {
      title: lang === 'en' ? '# FAST AND QUALITY' : '# ШВИДКО ТА ЯКІСНО',
      content: lang === 'en' 
        ? 'We provide 30% faster speed of AI solution development and implementation thanks to team resource optimization. All our employees are specialists with a highly professional approach to solving artificial intelligence tasks'
        : 'Забезпечуємо на 30% більшу швидкість розробки та впровадження AI-рішень завдяки оптимізації ресурсів команди. Всі наші співробітники — фахівці з високопрофесійним підходом до вирішення завдань штучного інтелекту',
      highlight: lang === 'en' ? '30% faster speed' : 'на 30% більшу швидкість',
      delay: "0.3s"
    },
    {
      title: lang === 'en' ? '# EFFICIENTLY' : '# ЕФЕКТИВНО',
      content: lang === 'en'
        ? 'We increase business process efficiency at various levels through the application of the latest AI technologies and close cooperation with solution providers'
        : 'Підвищуємо ефективність бізнес-процесів на різних рівнях завдяки застосуванню новітніх AI-технологій та тісній співпраці з постачальниками рішень',
      delay: "0.4s"
    },
    {
      title: lang === 'en' ? '# RELIABLY' : '# НАДІЙНО',
      content: lang === 'en'
        ? 'We guarantee high quality and stability of all implemented AI solutions through the use of proven technologies and multi-level testing'
        : 'Гарантуємо високу якість і стабільність усіх впроваджуваних AI-рішень завдяки використанню перевірених технологій і багаторівневому тестуванню',
      delay: "0.5s"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto mt-20 relative">
      <div className="mb-6 flex justify-between items-center reveal-on-scroll">
        <h3 className="text-2xl connexi-gradient-text">
          {lang === 'en' ? 'Our advantages' : 'Наші переваги'}
        </h3>
        <div className="flex gap-2 md:hidden">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full custom-carousel-button" 
            aria-label={lang === 'en' ? 'Previous slide' : 'Попередній слайд'}
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full custom-carousel-button" 
            aria-label={lang === 'en' ? 'Next slide' : 'Наступний слайд'}
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="card-glow absolute inset-0 -z-10 bg-connexi-pink/5 rounded-xl blur-3xl"></div>
      
      <Carousel className="w-full" opts={{ align: "start", loop: true }} setApi={setApi}>
        <CarouselContent className="-ml-2 md:-ml-4">
          {advantages.map((advantage, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2">
              <AdvantageCard
                title={advantage.title}
                content={advantage.content}
                highlight={advantage.highlight}
                className={className}
                animationDelay={advantage.delay}
                lang={lang}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="hidden md:block">
          <CarouselPrevious className="custom-carousel-button" />
          <CarouselNext className="custom-carousel-button" />
        </div>
      </Carousel>
    </div>
  );
};

export default AdvantagesCarousel;
