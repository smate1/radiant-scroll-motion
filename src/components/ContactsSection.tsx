
import React from "react";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSimpleChatContext } from "../contexts/SimpleChatContext";
import { Language, getTranslation } from "../lib/translations";

interface ContactsSectionProps {
  className?: string;
  lang: Language;
}

const ContactsSection: React.FC<ContactsSectionProps> = ({ className = "", lang }) => {
  const { openChat } = useSimpleChatContext();

  return (
    <section id="contacts" className={`py-20 bg-black text-white relative overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        {/* Section title */}
        <div className="mb-20 text-left">
          <div className="text-orange-500 text-xl font-semibold mb-6 reveal-on-scroll tracking-wide">
            {"{06}"} {lang === 'en' ? 'CONTACTS' : 'КОНТАКТИ'}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left column - Company info */}
          <div className="space-y-16 reveal-on-scroll h-full flex flex-col">
            {/* Company branding */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img 
                  src="/lovable-uploads/90d43a15-0546-4090-b01c-02f21a566125.png" 
                  alt="Connexi Logo"
                  className="h-12 w-auto object-contain"
                />
                <h3 className="text-3xl font-bold text-white">connexi</h3>
              </div>
              <p className="text-white/70 text-lg leading-relaxed">
                {lang === 'en' 
                  ? 'Transforming businesses with cutting-edge AI solutions' 
                  : 'Трансформуємо бізнес за допомогою передових AI-рішень'
                }
              </p>
            </div>

            {/* Contact information */}
            <div className="space-y-8 flex-grow">
              {/* Address */}
              <div className="group">
                <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  {lang === 'en' ? 'Address' : 'Адреса'}
                </h4>
                <p className="text-white/80 text-lg ml-8 group-hover:text-white transition-colors leading-snug">
                  {lang === 'en' ? 'Dnipro, Rabochaya, 23K' : 'Дніпро, Рабочая, 23К'}
                </p>
              </div>

              {/* Email */}
              <div className="group">
                <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-500" />
                  {lang === 'en' ? 'Email' : 'Електронна пошта'}
                </h4>
                <a 
                  href="mailto:info@connexi.io" 
                  className="text-white/80 hover:text-orange-500 transition-colors text-lg ml-8 block group-hover:translate-x-2 transform duration-300 leading-snug"
                >
                  info@connexi.io
                </a>
              </div>

              {/* Phone */}
              <div className="group">
                <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  {lang === 'en' ? 'Phone' : 'Телефон'}
                </h4>
                <a 
                  href="tel:+380999191191" 
                  className="text-white/80 hover:text-orange-500 transition-colors text-lg ml-8 block group-hover:translate-x-2 transform duration-300 leading-snug"
                >
                  +38(099)91-91-191
                </a>
              </div>
            </div>
          </div>

          {/* Right column - CTA Section */}
          <div className="space-y-12 reveal-on-scroll h-full flex flex-col justify-start">
            {/* Main heading */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                <span className="text-white">{getTranslation('contactsTitle1', lang)} </span>
                <span className="connexi-gradient-text">{getTranslation('contactsTitle2', lang)}</span>
                <br />
                <span className="text-white">{getTranslation('contactsTitle3', lang)} </span>
                <span className="connexi-gradient-text">{getTranslation('contactsTitle4', lang)}</span>
              </h2>
            </div>

            {/* CTA Button */}
            <div className="text-center lg:text-left">
              <Button 
                className="contact-button px-12 py-6 rounded-full transition-all pulse-on-hover font-semibold text-lg mb-12 shadow-2xl"
                onClick={openChat}
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                {getTranslation('consultation', lang)}
              </Button>
            </div>

            {/* Social Media Section */}
            <div className="space-y-6 mt-auto">
              <h4 className="text-xl font-semibold text-white text-center lg:text-left">
                {lang === 'en' ? 'Connect with us' : 'Зв\'яжіться з нами'}
              </h4>
              
              <div className="flex items-center justify-center lg:justify-start gap-6">
                <a 
                  href="https://t.me/ConnexiBot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-500/25"
                >
                  <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://wa.me/380999191191" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-green-500/25"
                >
                  <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="floating-element w-96 h-96 top-20 -left-48 opacity-10"></div>
      <div className="floating-element w-80 h-80 bottom-10 -right-40 opacity-10"></div>
    </section>
  );
};

export default ContactsSection;
