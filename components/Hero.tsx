import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Rosette } from './ui/Rosette';
import { RESTAURANT_INFO } from '../constants';

interface HeroProps {
  onOrderClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick }) => {
  return (
    <section id="home" className="relative min-h-[95vh] flex items-center pt-32 pb-16 overflow-hidden bg-brand-maroon">
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-brand-maroon">
         <div className="absolute inset-0 bg-paper-texture opacity-20 mix-blend-overlay"></div>
         
         {/* THE GOLDEN ROSETTE - More visible and slowly rotating */}
         <div className="absolute -right-[20vh] top-1/2 -translate-y-1/2 w-[80vh] h-[80vh] md:w-[100vh] md:h-[100vh] animate-[spin_100s_linear_infinite]">
            <Rosette className="w-full h-full text-brand-gold" opacity={0.35} />
         </div>

         {/* Another smaller one for balance on bottom left */}
         <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] animate-[spin_140s_linear_infinite_reverse]">
            <Rosette className="w-full h-full text-brand-gold" opacity={0.2} />
         </div>
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Text Content */}
        <div className="lg:col-span-6 order-2 lg:order-1 space-y-10 animate-fade-in-up text-center lg:text-left pt-10 lg:pt-0">
            
            {/* Top decorative line */}
            <div className="flex items-center justify-center lg:justify-start gap-4">
                 <div className="h-px w-8 bg-gradient-to-r from-transparent to-brand-gold"></div>
                 <span className="text-brand-gold/80 text-[10px] font-display tracking-[0.4em] uppercase">Restaurant Maghrébin</span>
                 <div className="h-px w-8 bg-gradient-to-l from-transparent to-brand-gold"></div>
            </div>
          
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-brand-cream leading-[0.85] tracking-tight">
                  Les Saveurs <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-[#FFF5D6] to-brand-gold italic pr-4 font-serif relative z-10 filter drop-shadow-sm">
                      du Maghreb
                  </span>
              </h1>
            </div>

            <p className="text-lg text-brand-cream/80 font-serif leading-relaxed max-w-lg mx-auto lg:mx-0 border-l border-brand-gold/30 pl-6">
                {RESTAURANT_INFO.slogan}
            </p>

            <p className="text-base text-brand-cream/60 font-sans leading-relaxed max-w-lg mx-auto lg:mx-0">
                {RESTAURANT_INFO.type} - Spécialités Couscous & Tajines
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
                <Button onClick={onOrderClick} className="bg-gradient-to-r from-brand-gold to-[#B8860B] text-brand-maroon hover:to-brand-gold shadow-glow-gold border-none">
                    Commander <ArrowRight size={18} />
                </Button>
                <Button variant="outline" onClick={onOrderClick} className="border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10 backdrop-blur-sm">
                    Voir la Carte
                </Button>
            </div>
        </div>

        {/* Image Content - Elegant Arch Window */}
        <div className="lg:col-span-6 order-1 lg:order-2 relative flex justify-center items-center">
            
            <div className="relative w-full max-w-[450px] aspect-[4/5]">
                {/* Gold Frame behind */}
                <div className="absolute inset-0 border border-brand-gold/30 rounded-t-full scale-105 translate-y-4"></div>
                <div className="absolute inset-0 border border-brand-gold/20 rounded-t-full scale-110 translate-y-8"></div>
                
                {/* Main Arch */}
                <div className="relative h-full w-full arch-mask shadow-2xl bg-black group">
                     {/* Image */}
                     <img 
                        src="/images/accueil.png" 
                        alt="Les Saveurs du Maghreb - Restaurant Maghrébin à Nancy" 
                        className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-[8s] ease-out"
                    />
                    
                    {/* Inner Gradient Overlay for Elegance */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon via-transparent to-transparent opacity-80"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                         <Rosette className="w-12 h-12 text-brand-gold mb-2 animate-[spin_10s_linear_infinite]" />
                         <span className="text-brand-gold text-xs tracking-[0.3em] uppercase border-b border-brand-gold/50 pb-1">Nancy</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};