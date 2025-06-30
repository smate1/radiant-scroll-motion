
"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-white" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-connexi-orange",
  titleClassName = "text-connexi-orange",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 bg-gray-900/70 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-white/20 hover:bg-gray-900/90 [&>*]:flex [&>*]:items-center [&>*]:gap-2 text-white",
        className
      )}
    >
      <div>
        <span className={cn("relative inline-block rounded-full bg-gray-800 p-1", iconClassName)}>
          {icon}
        </span>
        <p className={cn("text-lg font-bold", titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-lg">{description}</p>
      <p className="text-gray-400">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      icon: <Sparkles className="size-4 text-white" />,
      title: "АВТОМАТИЗАЦІЯ",
      description: "Оптимізація бізнес-процесів",
      date: "AI-системи",
      iconClassName: "bg-gradient-to-br from-connexi-purple to-connexi-blue",
      titleClassName: "text-connexi-purple font-bold drop-shadow-lg",
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[0%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Sparkles className="size-4 text-white" />,
      title: "АСИСТЕНТИ",
      description: "Автоматизація бізнес-процесів",
      date: "AI-рішення",
      iconClassName: "bg-gradient-to-br from-connexi-pink to-connexi-purple",
      titleClassName: "text-connexi-pink font-bold drop-shadow-lg",
      className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[0%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Sparkles className="size-4 text-white" />,
      title: "ЧАТ-БОТИ",
      description: "Підтримка продажів",
      date: "AI-рішення",
      iconClassName: "bg-gradient-to-br from-connexi-orange to-connexi-pink",
      titleClassName: "text-connexi-orange font-bold drop-shadow-lg",
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
