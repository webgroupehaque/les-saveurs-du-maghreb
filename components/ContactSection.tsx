import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useCart } from '@kit';
import { Rosette } from './ui/Rosette';
import { CheckoutForm } from './CheckoutForm';
import { useSiteContent } from '../lib/content';

export const ContactSection: React.FC = () => {
  const { settings, checkoutOpen, lines, ordering } = useCart();
  const { c, cl } = useSiteContent();
  const services = cl('about.services');
  return (
    <section id="contact" className="py-24 bg-brand-cream relative text-brand-maroon overflow-hidden">
      <div className="absolute -right-64 top-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none animate-[spin_160s_linear_infinite]">
        <Rosette className="w-full h-full text-brand-gold" opacity={0.05} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-brand-gold"></div>
            <Rosette className="w-12 h-12 text-brand-gold animate-[spin_20s_linear_infinite]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-brand-gold"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-display text-brand-maroon mb-4">Nous Contacter</h2>
          <p className="text-brand-maroon/70 font-serif text-lg max-w-2xl mx-auto">{c('contact.intro')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-brand-maroon/5 border border-brand-gold/20 p-8 text-center hover:bg-brand-maroon/10 transition-all group">
            <div className="w-16 h-16 rounded-full border-2 border-brand-gold/30 flex items-center justify-center mx-auto mb-6 group-hover:border-brand-gold transition-colors"><MapPin size={28} className="text-brand-gold" /></div>
            <h3 className="text-brand-gold font-bold uppercase text-xs tracking-[0.2em] mb-4">Adresse</h3>
            <p className="font-serif text-brand-maroon leading-relaxed">{settings.address}</p>
          </div>
          <div className="bg-brand-maroon/5 border border-brand-gold/20 p-8 text-center hover:bg-brand-maroon/10 transition-all group">
            <div className="w-16 h-16 rounded-full border-2 border-brand-gold/30 flex items-center justify-center mx-auto mb-6 group-hover:border-brand-gold transition-colors"><Phone size={28} className="text-brand-gold" /></div>
            <h3 className="text-brand-gold font-bold uppercase text-xs tracking-[0.2em] mb-4">Téléphone</h3>
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="font-serif text-brand-maroon hover:text-brand-gold transition-colors text-lg">{settings.phone}</a>
          </div>
          <div className="bg-brand-maroon/5 border border-brand-gold/20 p-8 text-center hover:bg-brand-maroon/10 transition-all group">
            <div className="w-16 h-16 rounded-full border-2 border-brand-gold/30 flex items-center justify-center mx-auto mb-6 group-hover:border-brand-gold transition-colors"><Mail size={28} className="text-brand-gold" /></div>
            <h3 className="text-brand-gold font-bold uppercase text-xs tracking-[0.2em] mb-4">Email</h3>
            <a href={`mailto:${settings.email}`} className="font-serif text-brand-maroon hover:text-brand-gold transition-colors break-all text-sm">{settings.email}</a>
          </div>
        </div>

        {settings.hours.length > 0 && (
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-brand-maroon text-brand-cream border border-brand-gold/20 p-12 relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-gold"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-brand-gold"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-brand-gold"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-gold"></div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-brand-gold/30 flex items-center justify-center flex-shrink-0"><Clock size={24} className="text-brand-gold" /></div>
                <div className="flex-1">
                  <h3 className="text-brand-gold font-bold uppercase text-xs tracking-[0.2em] mb-6">Horaires d'ouverture</h3>
                  <div className="space-y-3">
                    {settings.hours.map((h, idx) => (
                      <div key={idx} className="border-b border-brand-gold/10 pb-3 last:border-0 flex flex-wrap justify-between gap-2">
                        <span className="font-serif text-brand-cream/90">{h.days}</span>
                        <span className="font-serif text-brand-gold/90">{h.slots}</span>
                      </div>
                    ))}
                    {c('hours.detail') && <p className="text-brand-gold/80 text-sm mt-4 font-serif italic">{c('hours.detail')}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {services.length > 0 && (
          <div className="mt-12 text-center">
            <h3 className="text-brand-gold font-bold uppercase text-xs tracking-[0.2em] mb-6">Nos Services</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {services.map((service, idx) => (
                <span key={idx} className="px-6 py-3 bg-brand-maroon/10 border border-brand-gold/30 text-brand-maroon font-serif text-sm">{service}</span>
              ))}
            </div>
          </div>
        )}

        {ordering.enabled && checkoutOpen && lines.length > 0 && (
          <div id="checkout-form" className="mt-16">
            <CheckoutForm />
          </div>
        )}
      </div>
    </section>
  );
};
