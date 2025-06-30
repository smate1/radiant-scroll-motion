
import React, { useState, FormEvent } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Language, getTranslation } from "../lib/translations";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  lang: Language;
}

const ContactPopup: React.FC<ContactPopupProps> = ({ 
  isOpen, 
  onClose, 
  title,
  lang
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      toast({
        title: getTranslation('contactError', lang),
        description: getTranslation('contactErrorDescription', lang),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Симуляция отправки формы
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: getTranslation('contactSuccess', lang),
      description: getTranslation('contactSuccessDescription', lang),
    });
    
    setFormData({ name: "", phone: "", email: "", message: "" });
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const displayTitle = title || getTranslation('contactTitle', lang);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 shadow-2xl">
        <DialogHeader className="p-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
          <DialogTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-3">
              <img
                src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
                alt="AI Animation"
                className="h-6 w-6 rounded opacity-90"
              />
              {displayTitle}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-white/20 h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={getTranslation('contactName', lang)}
                className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder={getTranslation('contactPhone', lang)}
                className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder={getTranslation('contactEmail', lang)}
                className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <Textarea
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder={getTranslation('contactMessage', lang)}
                className="min-h-[100px] border-gray-200 focus:border-orange-500 focus:ring-orange-500 resize-none"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {getTranslation('contactSending', lang)}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {getTranslation('contactSend', lang)}
                </div>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactPopup;
