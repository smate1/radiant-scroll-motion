
import React, { useEffect } from "react";

const ScrollAnimation: React.FC = () => {
  useEffect(() => {
    let isScrolling = false;
    
    // Simplified and optimized reveal animation
    const handleReveal = () => {
      if (!isScrolling) {
        isScrolling = true;
        
        requestAnimationFrame(() => {
          const elements = document.querySelectorAll('.reveal-on-scroll');
          
          elements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 50) {
              element.classList.add('revealed');
            }
          });
          
          isScrolling = false;
        });
      }
    };

    // Simplified floating animation - only for desktop
    const animateFloatingElements = () => {
      if (window.innerWidth < 768) return; // Skip on mobile
      
      const floatingElements = document.querySelectorAll('.floating');
      
      floatingElements.forEach((element) => {
        const randomX = Math.random() * 5 - 2.5; // Reduced movement
        const randomY = Math.random() * 5 - 2.5;
        
        element.animate(
          [
            { transform: 'translate(0px, 0px)' },
            { transform: `translate(${randomX}px, ${randomY}px)` },
            { transform: 'translate(0px, 0px)' }
          ],
          {
            duration: 8000, // Slower animation
            iterations: Infinity,
            easing: 'ease-in-out'
          }
        );
      });
    };

    // Optimized tab content visibility
    const setupTabContentVisibility = () => {
      const tabContents = document.querySelectorAll('.services-tab-content');
      
      const tabsObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-state') {
            const target = mutation.target as Element;
            const isActive = target.getAttribute('data-state') === 'active';
            
            if (isActive) {
              target.classList.add('tab-visible');
            } else {
              setTimeout(() => {
                if ((target as Element).getAttribute('data-state') !== 'active') {
                  target.classList.remove('tab-visible');
                }
              }, 300);
            }
          }
        });
      });
      
      tabContents.forEach(tab => {
        if ((tab as Element).getAttribute('data-state') === 'active') {
          (tab as Element).classList.add('tab-visible');
        }
        
        tabsObserver.observe(tab, { attributes: true });
      });
    };
    
    // Add scroll event with throttling
    let scrollTimeout: NodeJS.Timeout;
    const throttledHandleReveal = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleReveal, 100); // Throttle scroll events
    };
    
    window.addEventListener('scroll', throttledHandleReveal, { passive: true });
    
    // Initialize
    handleReveal();
    setTimeout(animateFloatingElements, 1000); // Delay floating animations
    setupTabContentVisibility();
    
    return () => {
      window.removeEventListener('scroll', throttledHandleReveal);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  return null;
};

export default ScrollAnimation;
