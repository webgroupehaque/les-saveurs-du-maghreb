import React, { useState } from 'react';
import { CartProvider, useCart } from '@kit';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { Announcement } from './components/Announcement';
import { PaymentResult } from './components/PaymentResult';
import { ContentProvider } from './lib/content';
import { Legal, docFromPath, type Doc } from './components/Legal';

/** Le panier n'existe que si la commande est activée dans le CMS. */
const Ordering: React.FC = () => {
  const { ordering } = useCart();
  return ordering.enabled ? <CartSidebar /> : null;
};

function App() {
  const [activeSection, setActiveSection] = useState('home');
  // Pages légales : elles remplacent le contenu quand l'adresse le demande.
  const [legal, setLegal] = useState<Doc | null>(docFromPath());

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <CartProvider flyColor="#C9A24B">
      <ContentProvider>
        <div className="min-h-screen bg-brand-cream text-brand-maroon selection:bg-brand-maroon selection:text-brand-cream overflow-x-hidden font-sans">
          <Announcement />
          <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

          {legal ? (
            <Legal doc={legal} onClose={() => setLegal(null)} />
          ) : (
          <main>
            <Hero onOrderClick={() => scrollToSection('menu')} />

            <div className="relative h-24 bg-brand-maroon overflow-hidden">
              <svg className="absolute bottom-0 w-full h-full text-brand-cream fill-current" viewBox="0 0 1440 100" preserveAspectRatio="none">
                <path d="M0,80 C320,120 420,0 720,60 C1080,120 1320,20 1440,60 L1440,100 L0,100 Z"></path>
              </svg>
            </div>

            <MenuSection />

            <div className="relative h-24 bg-brand-cream -mb-1">
              <svg className="absolute bottom-0 w-full h-full text-brand-maroon fill-current" viewBox="0 0 1440 100" preserveAspectRatio="none">
                <path d="M0,20 C240,90 680,0 1440,60 L1440,100 L0,100 Z"></path>
              </svg>
            </div>

            <AboutSection />

            <div className="relative h-24 bg-brand-maroon -mb-1">
              <svg className="absolute bottom-0 w-full h-full text-brand-cream fill-current" viewBox="0 0 1440 100" preserveAspectRatio="none">
                <path d="M0,20 C240,90 680,0 1440,60 L1440,100 L0,100 Z"></path>
              </svg>
            </div>

            <ContactSection />
          </main>
          )}

          <Footer onLegal={(d: Doc) => { setLegal(d); window.scrollTo({ top: 0 }); }} />
          <Ordering />
          <PaymentResult />
        </div>
      </ContentProvider>
    </CartProvider>
  );
}

export default App;
