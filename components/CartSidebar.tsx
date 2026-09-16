import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { euro, useBodyScrollLock, useCart, useEscape } from '@kit';

export const CartSidebar: React.FC = () => {
  const { lines, count, subtotal, deliveryFee, total, orderType, setOrderType, isOpen, close, updateQty, remove, openCheckout, settings, ordering } = useCart();
  useBodyScrollLock(isOpen);
  useEscape(isOpen, close);
  const belowMin = settings.minOrder > 0 && subtotal < settings.minOrder;

  const goCheckout = () => {
    openCheckout();
    setTimeout(() => {
      const el = document.getElementById('checkout-form');
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 150, behavior: 'smooth' });
    }, 150);
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={close} />
      <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-brand-cream z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} aria-hidden={!isOpen}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-brand-maroon/10 bg-brand-maroon text-brand-cream">
            <div className="flex items-center gap-3">
              <ShoppingBag size={24} />
              <h2 className="text-2xl font-display font-bold">Mon Panier</h2>
              {count > 0 && <span className="bg-brand-gold text-brand-maroon text-xs font-bold px-2 py-1 rounded-full">{count}</span>}
            </div>
            <button onClick={close} className="p-2 hover:bg-brand-maroon-dark rounded-full transition-colors" aria-label="Fermer le panier">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {lines.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <ShoppingBag size={64} className="text-brand-maroon/20 mb-4" />
                <h3 className="text-xl font-display text-brand-maroon mb-2">Votre panier est vide</h3>
                <p className="text-brand-maroon/60 text-sm">Ajoutez des plats depuis notre carte</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ordering.modes.length > 1 && (
                  <div className="bg-white border border-brand-maroon/10 rounded-lg p-1 flex">
                    <button onClick={() => setOrderType('delivery')} className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors ${orderType === 'delivery' ? 'bg-brand-maroon text-brand-cream' : 'text-brand-maroon/60'}`}>Livraison</button>
                    <button onClick={() => setOrderType('pickup')} className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors ${orderType === 'pickup' ? 'bg-brand-maroon text-brand-cream' : 'text-brand-maroon/60'}`}>À emporter</button>
                  </div>
                )}
                {lines.map((l) => (
                  <div key={l.key} className="bg-white border border-brand-maroon/10 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      {l.item.image && (
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-brand-maroon/10">
                          <img src={l.item.image} alt={l.item.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-brand-maroon font-bold text-sm mb-1 line-clamp-2">{l.item.name}</h3>
                        {l.detail && <p className="text-xs text-brand-maroon/60 mb-2">{l.detail}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 border border-brand-maroon/20 rounded">
                            <button onClick={() => updateQty(l.key, -1)} className="p-1 hover:bg-brand-maroon/10 transition-colors rounded" aria-label="Diminuer la quantité"><Minus size={16} className="text-brand-maroon" /></button>
                            <span className="px-3 py-1 text-sm font-bold text-brand-maroon min-w-[2rem] text-center">{l.qty}</span>
                            <button onClick={() => updateQty(l.key, 1)} className="p-1 hover:bg-brand-maroon/10 transition-colors rounded" aria-label="Augmenter la quantité"><Plus size={16} className="text-brand-maroon" /></button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-display text-brand-gold font-bold">{euro(l.unitPrice * l.qty)}</p>
                            <p className="text-xs text-brand-maroon/50">{euro(l.unitPrice)} / unité</p>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => remove(l.key)} className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors self-start" aria-label="Supprimer l'article">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {lines.length > 0 && (
            <div className="border-t border-brand-maroon/10 bg-white p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-brand-maroon/70">Sous-total</span><span className="font-display text-brand-maroon font-bold">{euro(subtotal)}</span></div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-sm"><span className="text-brand-maroon/70">Frais de livraison</span><span className="font-display text-brand-maroon font-bold">{deliveryFee > 0 ? euro(deliveryFee) : 'Offerts'}</span></div>
                )}
                <div className="h-px bg-brand-maroon/10 my-2"></div>
                <div className="flex justify-between"><span className="text-lg font-display text-brand-maroon font-bold">Total</span><span className="text-2xl font-display text-brand-gold font-bold">{euro(total)}</span></div>
              </div>
              {belowMin && <p className="text-sm text-red-700">Minimum de commande : {euro(settings.minOrder)}.</p>}
              <button onClick={goCheckout} disabled={belowMin} className="w-full py-4 bg-brand-maroon hover:bg-brand-maroon-dark text-brand-cream font-bold text-sm uppercase tracking-widest transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50">
                Commander
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
