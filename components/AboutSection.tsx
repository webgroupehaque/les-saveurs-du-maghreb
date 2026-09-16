import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { useCart } from '@kit';
import { Rosette } from './ui/Rosette';
import { useSiteContent } from '../lib/content';

export const AboutSection: React.FC = () => {
  const { settings } = useCart();
  const { c, cl } = useSiteContent();
  const specialties = cl('about.specialties');
  const services = cl('about.services');
  return (
    <section id="about" className="py-24 bg-brand-maroon relative text-brand-cream overflow-hidden">
      <div className="absolute -left-64 top-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none animate-[spin_160s_linear_infinite]">
        <Rosette className="w-full h-full text-brand-gold" opacity={0.1} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row border border-brand-gold/20 bg-brand-maroon-dark/50 backdrop-blur-sm relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-gold"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-brand-gold"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-brand-gold"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-gold"></div>

          <div className="lg:w-1/2 relative min-h-[500px] border border-brand-gold/20 overflow-hidden bg-brand-maroon/10">
            {settings.address && (
              <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 w-full h-full" title={`Localisation Les Saveurs du Maghreb - ${settings.address}`}></iframe>
            )}
          </div>

          <div className="lg:w-1/2 p-12 md:p-16 flex flex-col justify-center">
            <div className="space-y-12">
              <div>
                <h4 className="text-brand-gold font-bold uppercase text-[10px] tracking-[0.2em] mb-4">À Propos</h4>
                <p className="font-serif text-lg leading-relaxed text-brand-cream/90 mb-6">{c('about.description')}</p>
                {specialties.length > 0 && (
                  <div className="mt-6">
                    <h5 className="text-brand-gold font-bold uppercase text-[10px] tracking-[0.2em] mb-3">Nos Spécialités</h5>
                    <div className="flex flex-wrap gap-3">
                      {specialties.map((s, idx) => <span key={idx} className="px-4 py-2 border border-brand-gold/30 text-brand-cream/80 text-sm font-serif">{s}</span>)}
                    </div>
                  </div>
                )}
                {services.length > 0 && (
                  <div className="mt-6">
                    <h5 className="text-brand-gold font-bold uppercase text-[10px] tracking-[0.2em] mb-3">Services</h5>
                    <div className="flex flex-wrap gap-3">
                      {services.map((s, idx) => <span key={idx} className="px-4 py-2 bg-brand-gold/10 border border-brand-gold/20 text-brand-cream/90 text-sm">{s}</span>)}
                    </div>
                  </div>
                )}
              </div>

              {settings.address && (
                <div className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-full border border-brand-gold/20 flex items-center justify-center group-hover:border-brand-gold transition-colors"><MapPin size={20} className="text-brand-gold" /></div>
                  <div>
                    <h4 className="text-brand-gold font-bold uppercase text-[10px] tracking-[0.2em] mb-3">Nous Trouver</h4>
                    <p className="font-serif text-xl leading-relaxed">{settings.address}</p>
                  </div>
                </div>
              )}
              {(settings.phone || settings.email) && (
                <div className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-full border border-brand-gold/20 flex items-center justify-center group-hover:border-brand-gold transition-colors"><Phone size={20} className="text-brand-gold" /></div>
                  <div>
                    <h4 className="text-brand-gold font-bold uppercase text-[10px] tracking-[0.2em] mb-3">Contact</h4>
                    <p className="font-serif text-xl">{settings.phone}</p>
                    <p className="text-sm opacity-50 font-sans mt-1">{settings.email}</p>
                  </div>
                </div>
              )}
              {settings.hours.length > 0 && (
                <div className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-full border border-brand-gold/20 flex items-center justify-center group-hover:border-brand-gold transition-colors"><Clock size={20} className="text-brand-gold" /></div>
                  <div className="w-full">
                    <h4 className="text-brand-gold font-bold uppercase text-[10px] tracking-[0.2em] mb-3">Horaires</h4>
                    <div className="space-y-2">
                      {settings.hours.map((h, idx) => (
                        <div key={idx} className="text-brand-cream/70 text-sm border-b border-brand-cream/5 pb-2 flex flex-wrap justify-between gap-2">
                          <span className="font-serif">{h.days}</span>
                          <span className="font-serif text-brand-cream/90">{h.slots}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
