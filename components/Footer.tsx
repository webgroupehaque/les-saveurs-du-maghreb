import React from 'react';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { useCart } from '@kit';
import { APP_NAME } from '../types';
import { useSiteContent } from '../lib/content';

export const Footer: React.FC<{ onLegal: (doc: 'mentions' | 'confidentialite' | 'cgv') => void }> = ({ onLegal }) => {
  const { settings } = useCart();
  const { c } = useSiteContent();
  const facebook = c('socials.facebook');
  const instagram = c('socials.instagram');
  return (
    <footer className="bg-brand-maroon-dark text-brand-cream pt-16 pb-8 border-t border-brand-gold/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-display text-brand-gold mb-3">{APP_NAME}</h2>
            <p className="text-brand-cream/60 text-sm mb-4">{c('footer.type')}</p>
            <p className="text-brand-cream/50 text-xs leading-relaxed">{c('hero.slogan')}</p>
            {(facebook || instagram) && (
              <div className="flex gap-3 mt-4 justify-center md:justify-start">
                {facebook && <a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-brand-gold/70 hover:text-brand-gold"><Facebook size={18} /></a>}
                {instagram && <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-brand-gold/70 hover:text-brand-gold"><Instagram size={18} /></a>}
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-brand-gold font-bold uppercase text-xs tracking-[0.2em] mb-4">Adresse</h3>
            <div className="flex items-start gap-3 justify-center md:justify-start">
              <MapPin size={18} className="text-brand-gold/70 mt-1 flex-shrink-0" />
              <p className="text-brand-cream/80 text-sm leading-relaxed">{settings.address}</p>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-brand-gold font-bold uppercase text-xs tracking-[0.2em] mb-4">Contact</h3>
            <div className="space-y-3">
              {settings.phone && (
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <Phone size={18} className="text-brand-gold/70 flex-shrink-0" />
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="text-brand-cream/80 text-sm hover:text-brand-gold transition-colors">{settings.phone}</a>
                </div>
              )}
              {settings.email && (
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <Mail size={18} className="text-brand-gold/70 flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="text-brand-cream/80 text-sm hover:text-brand-gold transition-colors break-all">{settings.email}</a>
                </div>
              )}
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-brand-gold font-bold uppercase text-xs tracking-[0.2em] mb-4">Horaires</h3>
            <div className="flex items-start gap-3 justify-center md:justify-start">
              <Clock size={18} className="text-brand-gold/70 mt-1 flex-shrink-0" />
              <div className="text-brand-cream/80 text-sm space-y-1">
                {settings.hours.slice(0, 4).map((h, i) => <p key={i} className="text-xs">{h.days} · {h.slots}</p>)}
                {c('hours.detail') && <p className="text-brand-gold/70 text-xs mt-2">{c('hours.detail')}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-brand-gold/10 pt-8 text-center text-brand-cream/40 text-sm">
          <p>&copy; {new Date().getFullYear()} {APP_NAME} - Tous droits réservés{settings.legalCompany ? ` · ${settings.legalCompany}` : ''}{settings.legalSiret ? ` · SIRET ${settings.legalSiret}` : ''}</p>
          <nav className="flex flex-wrap justify-center gap-4 text-xs mt-3">
            {([['Mentions légales', '/mentions-legales', 'mentions'], ['Confidentialité', '/confidentialite', 'confidentialite'], ['Conditions de vente', '/cgv', 'cgv']] as [string, string, 'mentions' | 'confidentialite' | 'cgv'][]).map(([libelle, chemin, doc]) => (
              <a
                key={chemin}
                href={chemin}
                onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', chemin); onLegal(doc); }}
                className="hover:text-brand-gold"
              >
                {libelle}
              </a>
            ))}
          </nav>
          <p className="text-xs mt-2">Site réalisé par <a href="https://rekvo.agency" target="_blank" rel="noreferrer" className="hover:text-brand-gold">Rekvo</a></p>
        </div>
      </div>
    </footer>
  );
};
