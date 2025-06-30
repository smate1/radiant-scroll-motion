
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSimpleChatContext } from '@/contexts/SimpleChatContext';
import { Language } from '@/lib/translations';

interface SimpleChatButtonProps {
  lang: Language;
}

export const SimpleChatButton: React.FC<SimpleChatButtonProps> = ({ lang }) => {
  const { openChat } = useSimpleChatContext();

  return (
    <Button
      onClick={openChat}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full contact-button shadow-lg hover:shadow-xl transition-all duration-300"
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};
