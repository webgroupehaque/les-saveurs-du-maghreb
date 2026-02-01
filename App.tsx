import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { MenuItem, CartItem, DeliveryInfo } from './types';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const addToCart = (item: MenuItem, selectedChoices?: Array<{id: string, name: string}>) => {
    setCartItems(prev => {
      // Créer un ID unique pour cet item (incluant les choix si c'est un plat composé)
      const uniqueId = item.options?.isComposed && selectedChoices
        ? `${item.id}-${selectedChoices.map(c => c.id).sort().join('-')}`
        : item.id;

      // Vérifie si l'item existe déjà (même id unique)
      const existingIndex = prev.findIndex(cartItem => cartItem.id === uniqueId);

      if (existingIndex >= 0) {
        // Item existe : incrémente la quantité
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        // Créer le nom avec les choix si c'est un plat composé
        let displayName = item.name;
        if (selectedChoices && selectedChoices.length > 0) {
          // Compter les occurrences de chaque choix
          const choiceCounts: { [key: string]: number } = {};
          selectedChoices.forEach(choice => {
            choiceCounts[choice.name] = (choiceCounts[choice.name] || 0) + 1;
          });
          
          const choiceString = Object.entries(choiceCounts)
            .map(([name, count]) => count > 1 ? `${name} x${count}` : name)
            .join(', ');
          
          displayName = `${item.name} (${choiceString})`;
        }

        // Nouvel item : ajoute au panier
        const cartItem: CartItem = {
          id: uniqueId,
          name: displayName,
          price: item.price,
          quantity: 1,
          category: item.category,
          image: item.image,
          options: selectedChoices ? { selectedChoices } : undefined
        };
        return [...prev, cartItem];
      }
    });
    
    // Ouvre le panier automatiquement
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckingOut(true);
    
    // Scroll directement vers le formulaire de commande (en haut avec offset pour la navbar)
    setTimeout(() => {
      const checkoutForm = document.getElementById('checkout-form');
      if (checkoutForm) {
        const elementPosition = checkoutForm.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 150; // 150px pour la navbar et plus d'espace
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Si le formulaire n'est pas encore rendu, scroll vers contact puis vers le formulaire
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          const elementPosition = contactSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 150;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Attendre que le formulaire soit rendu puis scroll vers lui
          setTimeout(() => {
            const form = document.getElementById('checkout-form');
            if (form) {
              const formPosition = form.getBoundingClientRect().top;
              const formOffset = formPosition + window.pageYOffset - 150;
              
              window.scrollTo({
                top: formOffset,
                behavior: 'smooth'
              });
            }
          }, 300);
        }
      }
    }, 100);
  };

  const handleOrderSubmit = async (deliveryInfo: DeliveryInfo) => {
    try {
      setIsCheckingOut(true);
      
      // Calculer le total final
      const finalDeliveryFee = deliveryInfo.orderType === 'delivery' ? deliveryFee : 0;
      const finalTotal = subtotal + finalDeliveryFee;
      
      // Appeler la fonction Netlify pour créer la session Stripe
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cartItems,
          deliveryInfo: deliveryInfo,
          subtotal: subtotal,
          deliveryFee: finalDeliveryFee,
          total: finalTotal,
          restaurantId: 'saveurs-maghreb'
        }),
      });
      
      const { url, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }
      
      if (!url) {
        throw new Error('Aucune URL de paiement reçue');
      }
      
      // Rediriger vers Stripe Checkout
      window.location.href = url;
      
    } catch (error: any) {
      console.error('Erreur lors de la commande :', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
      setIsCheckingOut(false);
    }
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.50;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-brand-cream text-brand-maroon selection:bg-brand-maroon selection:text-brand-cream overflow-x-hidden font-sans">
      <Navbar 
        activeSection={activeSection} 
        onNavigate={scrollToSection} 
        cartCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main>
        <Hero onOrderClick={() => scrollToSection('menu')} />
        
        {/* Transition: Maroon to Cream with a curved divider or pattern */}
        <div className="relative h-24 bg-brand-maroon overflow-hidden">
            {/* Abstract curve SVG separating Hero (Maroon) and Menu (Cream) */}
            <svg className="absolute bottom-0 w-full h-full text-brand-cream fill-current" viewBox="0 0 1440 100" preserveAspectRatio="none">
                <path d="M0,80 C320,120 420,0 720,60 C1080,120 1320,20 1440,60 L1440,100 L0,100 Z"></path>
            </svg>
        </div>

        <MenuSection onAddToCart={addToCart} />
        
        {/* Transition: Cream to Maroon for About Section */}
        <div className="relative h-24 bg-brand-cream -mb-1">
             <svg className="absolute bottom-0 w-full h-full text-brand-maroon fill-current" viewBox="0 0 1440 100" preserveAspectRatio="none">
                <path d="M0,20 C240,90 680,0 1440,60 L1440,100 L0,100 Z"></path>
            </svg>
        </div>
        
        <AboutSection />
        
        {/* Transition: Maroon to Cream for Contact Section */}
        <div className="relative h-24 bg-brand-maroon -mb-1">
             <svg className="absolute bottom-0 w-full h-full text-brand-cream fill-current" viewBox="0 0 1440 100" preserveAspectRatio="none">
                <path d="M0,20 C240,90 680,0 1440,60 L1440,100 L0,100 Z"></path>
            </svg>
        </div>
        
        <ContactSection 
          isCheckingOut={isCheckingOut}
          cartItems={cartItems}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          onOrderSubmit={handleOrderSubmit}
        />
      </main>

      <Footer />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default App;