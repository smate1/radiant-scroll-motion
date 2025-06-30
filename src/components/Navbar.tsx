import React, { useEffect, useState, useCallback } from "react";
import { MessageCircle, Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSimpleChatContext } from "../contexts/SimpleChatContext";
import { Language, getTranslation } from "../lib/translations";

interface NavbarProps {
  lang: Language;
}

const Navbar: React.FC<NavbarProps> = ({ lang }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openChat } = useSimpleChatContext();
  const navigate = useNavigate();

  const switchLanguage = useCallback(() => {
    const newLang = lang === 'uk' ? 'en' : 'uk';
    const newPath = newLang === 'en' ? '/en' : '/';
    navigate(newPath);
  }, [lang, navigate]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleMobileNavClick = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileMenu();
  }, [closeMobileMenu]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-sm shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href={lang === 'en' ? '/en' : '/'} className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/f2300c53-5778-4a55-925b-831069852a60.png" 
            alt="connexi.ai logo" 
            className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
          />
          <div className="flex flex-col">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              connexi
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-600 italic">
              Linking Ideas to Solutions
            </div>
          </div>
        </a>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#about" className="text-gray-700 hover:text-black transition-colors">
            {getTranslation('about', lang)}
          </a>
          <a href="#assistant" className="text-gray-700 hover:text-black transition-colors">
            {getTranslation('assistant', lang)}
          </a>
          <a href="#services" className="text-gray-700 hover:text-black transition-colors">
            {getTranslation('services', lang)}
          </a>
          <a href="#partners" className="text-gray-700 hover:text-black transition-colors">
            {getTranslation('partners', lang)}
          </a>
          <a href="#cases" className="text-gray-700 hover:text-black transition-colors">
            {getTranslation('cases', lang)}
          </a>
          <a href="#contacts" className="text-gray-700 hover:text-black transition-colors">
            {getTranslation('contacts', lang)}
          </a>
          
          <Button 
            variant="ghost"
            size="sm"
            onClick={switchLanguage}
            className="text-gray-700 hover:text-black transition-colors flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {lang === 'uk' ? 'EN' : 'УК'}
          </Button>
          
          <Button 
            className="contact-button"
            size="sm"
            onClick={openChat}
          >
            {getTranslation('consultation', lang)}
            <MessageCircle className="ml-2 h-4 w-4" />
          </Button>
        </nav>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <Button 
            variant="ghost"
            size="sm"
            onClick={switchLanguage}
            className="text-gray-700 hover:text-black transition-colors"
          >
            <Globe className="h-4 w-4" />
          </Button>
          <Button 
            className="contact-button"
            size="sm"
            onClick={openChat}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <button 
              onClick={() => handleMobileNavClick('#about')}
              className="text-gray-700 hover:text-black transition-colors text-left"
            >
              {getTranslation('about', lang)}
            </button>
            <button 
              onClick={() => handleMobileNavClick('#assistant')}
              className="text-gray-700 hover:text-black transition-colors text-left"
            >
              {getTranslation('assistant', lang)}
            </button>
            <button 
              onClick={() => handleMobileNavClick('#services')}
              className="text-gray-700 hover:text-black transition-colors text-left"
            >
              {getTranslation('services', lang)}
            </button>
            <button 
              onClick={() => handleMobileNavClick('#partners')}
              className="text-gray-700 hover:text-black transition-colors text-left"
            >
              {getTranslation('partners', lang)}
            </button>
            <button 
              onClick={() => handleMobileNavClick('#cases')}
              className="text-gray-700 hover:text-black transition-colors text-left"
            >
              {getTranslation('cases', lang)}
            </button>
            <button 
              onClick={() => handleMobileNavClick('#contacts')}
              className="text-gray-700 hover:text-black transition-colors text-left"
            >
              {getTranslation('contacts', lang)}
            </button>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
              <span className="text-gray-600 text-sm">Language:</span>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => {
                  switchLanguage();
                  closeMobileMenu();
                }}
                className="text-connexi-orange hover:text-connexi-pink transition-colors"
              >
                {lang === 'uk' ? 'English' : 'Українська'}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
