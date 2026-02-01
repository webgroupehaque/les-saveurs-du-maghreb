import React from 'react';
import { CONTACT_INFO, RESTAURANT_INFO } from '../constants';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Rosette } from './ui/Rosette';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-brand-maroon relative text-brand-cream overflow-hidden">
      {/* Large Decorative Rosette Background - Rotating */}
      <div className="absolute -left-64 top-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none animate-[spin_160s_linear_infinite]">
        <Rosette className="w-full h-full text-brand-gold" opacity={0.1} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex flex-col lg:flex-row border border-brand-gold/20 bg-brand-maroon-dark/50 backdrop-blur-sm relative">
            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-gold"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-brand-gold"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-brand-gold"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-gold"></div>
            
            {/* Left: Google Maps */}
            <div className="lg:w-1/2 relative min-h-[500px] border border-brand-gold/20 overflow-hidden bg-brand-maroon/10">
                <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(RESTAURANT_INFO.address.full)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full"
                    title="Localisation Les Saveurs du Maghreb - 21 Rue des Maréchaux, 54000 Nancy"
                ></iframe>
            </div>

            {/* Right: Info */}
            <div className="lg:w-1/2 p-12 md:p-16 flex flex-col justify-center">
                <div className="space-y-12">
                    {/* Description */}
                    <div>
                        <h4 className="text-brand-gold font-bold uppercase text-[10px] tracking-[0.2em] mb-4">À Propos</h4>
                        <p className="font-serif text-lg leading-relaxed text-brand-cream/90 mb-6">
                            {RESTAURANT_INFO.description}
                        </p>
                        
                        {/* Spécialités */}
                        <div className="mt-6">
                            <h5 className="text-brand-gold font-bold uppercase text-[10px] tracking-[0.2em] mb-3">Nos Spécialités</h5>
                            <div className="flex flex-wrap gap-3">
                                {RESTAURANT_INFO.specialties.map((specialty, idx) => (
                                    <span key={idx} className="px-4 py-2 border border-brand-gold/30 text-brand-cream/80 text-sm font-serif">
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Services */}
                        <div className="mt-6">
                            <h5 className="text-brand-gold font-bold uppercase text-[10px] tracking-[0.2em] mb-3">Services</h5>
                            <div className="flex flex-wrap gap-3">
                                {RESTAURANT_INFO.services.map((service, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-brand-gold/10 border border-brand-gold/20 text-brand-cream/90 text-sm">
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6 items-start group">
                        <div className="w-12 h-12 rounded-full border border-brand-gold/20 flex items-center justify-center group-hover:border-brand-gold transition-colors">
                             <MapPin size={20} className="text-brand-gold" />
                        </div>
                        <div>
                            <h4 className="text-brand-gold font-bold uppercase text-[10px] tracking-[0.2em] mb-3">Nous Trouver</h4>
                            <p className="font-serif text-xl leading-relaxed">{CONTACT_INFO.address}</p>
                        </div>
                    </div>

                    <div className="flex gap-6 items-start group">
                        <div className="w-12 h-12 rounded-full border border-brand-gold/20 flex items-center justify-center group-hover:border-brand-gold transition-colors">
                             <Phone size={20} className="text-brand-gold" />
                        </div>
                        <div>
                            <h4 className="text-brand-gold font-bold uppercase text-[10px] tracking-[0.2em] mb-3">Contact</h4>
                            <p className="font-serif text-xl">{CONTACT_INFO.phone}</p>
                            <p className="text-sm opacity-50 font-sans mt-1">{CONTACT_INFO.email}</p>
                        </div>
                    </div>

                    <div className="flex gap-6 items-start group">
                         <div className="w-12 h-12 rounded-full border border-brand-gold/20 flex items-center justify-center group-hover:border-brand-gold transition-colors">
                             <Clock size={20} className="text-brand-gold" />
                        </div>
                        <div className="w-full">
                            <h4 className="text-brand-gold font-bold uppercase text-[10px] tracking-[0.2em] mb-3">Horaires</h4>
                            <div className="space-y-2">
                                {CONTACT_INFO.openingHours.map((hour, idx) => (
                                    <div key={idx} className="text-brand-cream/70 text-sm border-b border-brand-cream/5 pb-2">
                                        <span className="font-serif">{hour}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};