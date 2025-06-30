
import { useState, useEffect, useCallback } from 'react';

export const useTypingActivity = (delay: number = 1000) => {
  const [isTyping, setIsTyping] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const startTyping = useCallback(() => {
    setIsTyping(true);
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const newTimeoutId = setTimeout(() => {
      setIsTyping(false);
    }, delay);
    
    setTimeoutId(newTimeoutId);
  }, [delay, timeoutId]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return { isTyping, startTyping };
};
