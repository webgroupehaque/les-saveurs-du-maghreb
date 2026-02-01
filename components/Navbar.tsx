import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { APP_NAME } from '../constants';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  cartCount: number;
  onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, cartCount, onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Accueil' },
    { id: 'menu', label: 'Carte' },
    { id: 'about', label: 'À propos' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-brand-maroon py-3 shadow-lg' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer group gap-3" 
          onClick={() => onNavigate('home')}
        >
          {/* Logo Icon inspired by Calligraphy shape */}
          <div className="w-10 h-10 bg-brand-gold rounded-tl-xl rounded-br-xl flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
             <span className="text-brand-maroon font-serif font-bold text-xl -rotate-45 group-hover:rotate-0 transition-transform duration-500">L</span>
          </div>
          
          <div className="flex flex-col">
              <span className="text-xl font-display font-bold tracking-widest uppercase text-brand-cream drop-shadow-md">
                {APP_NAME}
              </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-center flex-1 space-x-10">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 relative py-1 hover:text-brand-gold ${
                activeSection === link.id ? 'text-brand-gold' : 'text-brand-cream'
              }`}
            >
              {link.label}
              <span className={`absolute bottom-0 left-0 h-[2px] bg-brand-gold transition-all duration-300 ${activeSection === link.id ? 'w-full' : 'w-0'}`}></span>
            </button>
          ))}
        </div>

        {/* Cart Button */}
        <div className="hidden md:flex items-center">
          <button
            onClick={onCartClick}
            className="relative p-2 text-brand-cream hover:text-brand-gold transition-colors rounded-full hover:bg-brand-maroon-dark"
            aria-label="Ouvrir le panier"
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-maroon text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-brand-cream">
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-brand-maroon border-b border-brand-gold/20 transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100 shadow-2xl' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col p-8 space-y-6 items-center">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`text-lg font-display tracking-widest uppercase ${
                activeSection === link.id ? 'text-brand-gold' : 'text-brand-cream'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              onCartClick();
              setMobileMenuOpen(false);
            }}
            className="relative p-2 text-brand-cream hover:text-brand-gold transition-colors"
            aria-label="Ouvrir le panier"
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-maroon text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};