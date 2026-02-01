import React, { useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  // Fermer avec ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Empêcher le scroll du body quand le panier est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.50;
  const total = subtotal + deliveryFee;

  const handleDecrease = (item: CartItem) => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      if (window.confirm('Voulez-vous supprimer cet article du panier ?')) {
        onRemoveItem(item.id);
      }
    }
  };

  const handleRemove = (item: CartItem) => {
    if (window.confirm(`Voulez-vous supprimer "${item.name}" du panier ?`)) {
      onRemoveItem(item.id);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-brand-cream z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-brand-maroon/10 bg-brand-maroon text-brand-cream">
            <div className="flex items-center gap-3">
              <ShoppingBag size={24} />
              <h2 className="text-2xl font-display font-bold">Mon Panier</h2>
              {cartItemsCount > 0 && (
                <span className="bg-brand-gold text-brand-maroon text-xs font-bold px-2 py-1 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-brand-maroon-dark rounded-full transition-colors"
              aria-label="Fermer le panier"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <ShoppingBag size={64} className="text-brand-maroon/20 mb-4" />
                <h3 className="text-xl font-display text-brand-maroon mb-2">Votre panier est vide</h3>
                <p className="text-brand-maroon/60 text-sm">Ajoutez des plats depuis notre carte</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-brand-maroon/10 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      {item.image && (
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-brand-maroon/10">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-brand-maroon font-bold text-sm mb-2 line-clamp-2">
                          {item.name}
                        </h3>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 border border-brand-maroon/20 rounded">
                            <button
                              onClick={() => handleDecrease(item)}
                              className="p-1 hover:bg-brand-maroon/10 transition-colors rounded"
                              aria-label="Diminuer la quantité"
                            >
                              <Minus size={16} className="text-brand-maroon" />
                            </button>
                            <span className="px-3 py-1 text-sm font-bold text-brand-maroon min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-brand-maroon/10 transition-colors rounded"
                              aria-label="Augmenter la quantité"
                            >
                              <Plus size={16} className="text-brand-maroon" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-sm font-display text-brand-gold font-bold">
                              {(item.price * item.quantity).toFixed(2).replace('.', ',')}€
                            </p>
                            <p className="text-xs text-brand-maroon/50">
                              {item.price.toFixed(2).replace('.', ',')}€ / unité
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors self-start"
                        aria-label="Supprimer l'article"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-brand-maroon/10 bg-white p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-maroon/70">Sous-total</span>
                  <span className="font-display text-brand-maroon font-bold">
                    {subtotal.toFixed(2).replace('.', ',')}€
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-maroon/70">Frais de livraison</span>
                  <span className="font-display text-brand-maroon font-bold">
                    {deliveryFee.toFixed(2).replace('.', ',')}€
                  </span>
                </div>
                <div className="h-px bg-brand-maroon/10 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-lg font-display text-brand-maroon font-bold">Total</span>
                  <span className="text-2xl font-display text-brand-gold font-bold">
                    {total.toFixed(2).replace('.', ',')}€
                  </span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-4 bg-brand-maroon hover:bg-brand-maroon-dark text-brand-cream font-bold text-sm uppercase tracking-widest transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Commander
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
