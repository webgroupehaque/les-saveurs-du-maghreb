import React from 'react';
import { RESTAURANT_INFO, CONTACT_INFO } from '../constants';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-maroon-dark text-brand-cream pt-16 pb-8 border-t border-brand-gold/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Colonne 1: Nom et description */}
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-display text-brand-gold mb-3">{RESTAURANT_INFO.name}</h2>
                <p className="text-brand-cream/60 text-sm mb-4">{RESTAURANT_INFO.type}</p>
                <p className="text-brand-cream/50 text-xs leading-relaxed">{RESTAURANT_INFO.slogan}</p>
            </div>
            
            {/* Colonne 2: Adresse */}
            <div className="text-center md:text-left">
                <h3 className="text-brand-gold font-bold uppercase text-xs tracking-[0.2em] mb-4">Adresse</h3>
                <div className="flex items-start gap-3 justify-center md:justify-start">
                    <MapPin size={18} className="text-brand-gold/70 mt-1 flex-shrink-0" />
                    <p className="text-brand-cream/80 text-sm leading-relaxed">
                        {RESTAURANT_INFO.address.full}
                    </p>
                </div>
            </div>
            
            {/* Colonne 3: Contact */}
            <div className="text-center md:text-left">
                <h3 className="text-brand-gold font-bold uppercase text-xs tracking-[0.2em] mb-4">Contact</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <Phone size={18} className="text-brand-gold/70 flex-shrink-0" />
                        <a href={`tel:${RESTAURANT_INFO.contact.phone}`} className="text-brand-cream/80 text-sm hover:text-brand-gold transition-colors">
                            {RESTAURANT_INFO.contact.phone}
                        </a>
                    </div>
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <Mail size={18} className="text-brand-gold/70 flex-shrink-0" />
                        <a href={`mailto:${RESTAURANT_INFO.contact.email}`} className="text-brand-cream/80 text-sm hover:text-brand-gold transition-colors break-all">
                            {RESTAURANT_INFO.contact.email}
                        </a>
                    </div>
                </div>
            </div>
            
            {/* Colonne 4: Horaires */}
            <div className="text-center md:text-left">
                <h3 className="text-brand-gold font-bold uppercase text-xs tracking-[0.2em] mb-4">Horaires</h3>
                <div className="flex items-start gap-3 justify-center md:justify-start">
                    <Clock size={18} className="text-brand-gold/70 mt-1 flex-shrink-0" />
                    <div className="text-brand-cream/80 text-sm space-y-1">
                        <p className="text-xs">Voir horaires détaillés</p>
                        <p className="text-brand-gold/70 text-xs mt-2">{RESTAURANT_INFO.hours.detail}</p>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-brand-gold/10 pt-8 text-center text-brand-cream/40 text-sm">
            <p>&copy; {RESTAURANT_INFO.name} - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
};