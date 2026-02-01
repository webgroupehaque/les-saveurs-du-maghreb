import React, { useState, useMemo } from 'react';
import { MENU_ITEMS, MENU_CATEGORIES } from '../constants';
import { MenuItem } from '../types';
import { Plus, X } from 'lucide-react';
import { Rosette } from './ui/Rosette';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, selectedChoices?: Array<{id: string, name: string}>) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Tout');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);

  const categories = [
    { id: 'Tout', label: 'Tout' },
    ...MENU_CATEGORIES.map(cat => ({ id: cat, label: cat }))
  ];

  const filteredItems = useMemo(() => {
    if (activeCategory === 'Tout') return MENU_ITEMS;
    return MENU_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const handleItemClick = (item: MenuItem) => {
    if (item.options?.isComposed) {
      setSelectedItem(item);
      setSelectedChoices([]);
    } else {
      onAddToCart(item);
    }
  };

  const handleChoiceToggle = (choiceId: string) => {
    if (!selectedItem?.options) return;
    
    setSelectedChoices(prev => {
      // Si on n'a pas encore atteint le nombre requis, on peut ajouter le parfum
      if (prev.length < selectedItem.options!.requiredSelections!) {
        return [...prev, choiceId];
      }
      // Si on a atteint le maximum, on retire le dernier de ce parfum
      else {
        // Trouver le dernier index de ce parfum et le retirer
        const lastIndex = prev.lastIndexOf(choiceId);
        if (lastIndex !== -1) {
          return prev.filter((_, index) => index !== lastIndex);
        }
      }
      return prev;
    });
  };

  const handleAddComposedItem = () => {
    if (!selectedItem || selectedChoices.length !== selectedItem.options?.requiredSelections) return;
    
    // Créer le tableau des choix sélectionnés avec leurs noms et prix
    const selectedChoicesWithNames = selectedChoices.map(id => {
      const choice = selectedItem.options!.availableChoices!.find(c => c.id === id);
      return {
        id: id,
        name: choice?.name || ''
      };
    }).filter(c => c.name !== '');
    
    // Calculer le prix total selon les choix sélectionnés
    const totalPrice = selectedChoices.reduce((sum, choiceId) => {
      const choice = selectedItem.options!.availableChoices!.find(c => c.id === choiceId);
      return sum + (choice?.price || 0);
    }, 0);
    
    // Créer un item avec le prix calculé
    const itemWithPrice = {
      ...selectedItem,
      price: totalPrice
    };
    
    // Appeler onAddToCart avec les choix sélectionnés
    onAddToCart(itemWithPrice, selectedChoicesWithNames);
    setSelectedItem(null);
    setSelectedChoices([]);
  };

  return (
    <section id="menu" className="py-24 relative bg-brand-cream text-brand-maroon overflow-hidden">
        {/* Subtle Rosette Pattern Background - Animated & More Visible */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-64 -left-64 w-[600px] h-[600px] animate-[spin_160s_linear_infinite]">
                 <Rosette className="w-full h-full text-brand-maroon" opacity={0.08} />
            </div>
            <div className="absolute top-1/2 -right-64 w-[800px] h-[800px] animate-[spin_180s_linear_infinite_reverse]">
                <Rosette className="w-full h-full text-brand-maroon" opacity={0.08} />
            </div>
        </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16">
            <Rosette className="w-10 h-10 text-brand-maroon mb-4 animate-[spin_30s_linear_infinite]" opacity={0.8} />
            <h2 className="text-4xl md:text-5xl font-display text-brand-maroon mb-4">
                La Carte
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-maroon to-transparent opacity-50"></div>
        </div>

        {/* Filter - Refined Minimalist */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`pb-1 text-xs uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'text-brand-maroon border-b-2 border-brand-maroon font-bold'
                  : 'text-brand-maroon/50 hover:text-brand-maroon border-b border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid - Elegant Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-white/30 hover:bg-white/60 border border-brand-maroon/10 hover:border-brand-gold/30 transition-all duration-500 rounded-lg overflow-hidden shadow-sm hover:shadow-md"
            >
              {/* Image */}
              {item.image && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover filter sepia-[0.2] group-hover:sepia-0 transition-all duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon/20 to-transparent"></div>
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-serif text-brand-maroon group-hover:text-brand-maroon-dark transition-colors flex-1 pr-2">
                    {item.name}
                  </h3>
                  {item.options?.isComposed && (item.id === 'eau' || item.id === 'soda' || item.id === 'samoussas') ? (
                    <span className="text-xl font-display text-brand-gold font-bold flex-shrink-0">
                      {item.options.availableChoices?.[0]?.price?.toFixed(2).replace('.', ',') || '0,00'}€
                    </span>
                  ) : item.options?.isComposed ? (
                    <span className="text-sm font-display text-brand-maroon/60 flex-shrink-0">
                      À partir de
                    </span>
                  ) : (
                    <span className="text-xl font-display text-brand-gold font-bold flex-shrink-0">
                      {item.price.toFixed(2).replace('.', ',')}€
                    </span>
                  )}
                </div>
                
                <p className="text-brand-maroon/70 text-sm font-serif leading-relaxed mb-4 min-h-[3rem]">
                  {item.description}
                </p>


                {/* Button */}
                <button 
                  onClick={() => handleItemClick(item)}
                  className="w-full py-2.5 bg-brand-maroon hover:bg-brand-maroon-dark text-brand-cream font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 rounded"
                >
                  {item.options?.isComposed ? 'Choisir' : 'Ajouter'} <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Composed Items */}
        {selectedItem && selectedItem.options?.isComposed && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)}>
            <div className="bg-brand-cream rounded-lg max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-display text-brand-maroon">{selectedItem.name}</h3>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="text-brand-maroon hover:text-brand-gold transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-brand-maroon/70 mb-4 font-serif">
                Sélectionnez {selectedItem.options.requiredSelections} parfum(s) :
              </p>
              
              <div className="space-y-2 mb-6">
                {selectedItem.options.availableChoices?.map((choice) => {
                  const count = selectedChoices.filter(id => id === choice.id).length;
                  const choicePrice = choice.price || 0;
                  const showPrice = !(selectedItem.id === 'eau' || selectedItem.id === 'soda' || selectedItem.id === 'samoussas');
                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleChoiceToggle(choice.id)}
                      className={`w-full p-3 text-left border-2 rounded transition-all flex justify-between items-center ${
                        count > 0
                          ? 'border-brand-gold bg-brand-gold/10 text-brand-maroon'
                          : 'border-brand-maroon/20 hover:border-brand-gold/50 text-brand-maroon/70'
                      }`}
                    >
                      <span className="font-medium">{choice.name}</span>
                      <div className="flex items-center gap-2">
                        {showPrice && (
                          <span className="text-brand-gold font-bold">
                            {choicePrice.toFixed(2).replace('.', ',')}€
                          </span>
                        )}
                        {count > 0 && (
                          <span className="bg-brand-gold text-brand-maroon rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="flex justify-between items-center mb-4 p-3 bg-brand-maroon/5 rounded-lg">
                <span className="text-sm text-brand-maroon/70">
                  {selectedChoices.length} / {selectedItem.options.requiredSelections} sélectionné(s)
                </span>
                <span className="text-xl font-display text-brand-gold font-bold">
                  {selectedChoices.reduce((sum, choiceId) => {
                    const choice = selectedItem.options!.availableChoices!.find(c => c.id === choiceId);
                    return sum + (choice?.price || 0);
                  }, 0).toFixed(2).replace('.', ',')}€
                </span>
              </div>
              
              <button
                onClick={handleAddComposedItem}
                disabled={selectedChoices.length !== selectedItem.options.requiredSelections}
                className={`w-full py-3 font-bold text-sm uppercase tracking-widest transition-all duration-300 rounded ${
                  selectedChoices.length === selectedItem.options.requiredSelections
                    ? 'bg-brand-maroon hover:bg-brand-maroon-dark text-brand-cream'
                    : 'bg-brand-maroon/30 text-brand-maroon/50 cursor-not-allowed'
                }`}
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};