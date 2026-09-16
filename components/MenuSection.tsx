import React, { useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { euro, missingRequired, pick, selectionDetail, unitPrice, useBodyScrollLock, useCart, useEscape, useMenu, type MenuItem, type Selection } from '@kit';
import { Rosette } from './ui/Rosette';

export const MenuSection: React.FC = () => {
  const { menu, loading, error } = useMenu();
  const { add, ordering } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>('Tout');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [sel, setSel] = useState<Selection>({});
  useBodyScrollLock(!!selectedItem);
  useEscape(!!selectedItem, () => setSelectedItem(null));

  const categories = [{ id: 'Tout', label: 'Tout' }, ...menu.categories.map((cat) => ({ id: cat.name, label: cat.name }))];
  const filteredItems = useMemo(() => (activeCategory === 'Tout' ? menu.items : menu.items.filter((item) => item.category === activeCategory)), [activeCategory, menu.items]);

  const handleItemClick = (item: MenuItem, source: HTMLElement | null) => {
    if (item.options.length > 0) {
      setSelectedItem(item);
      setSel({});
    } else {
      add(item, { source });
    }
  };

  const total = selectedItem ? unitPrice(selectedItem, sel) : 0;
  const missing = selectedItem ? missingRequired(selectedItem.options, sel) : true;

  return (
    <section id="menu" className="py-24 relative bg-brand-cream text-brand-maroon overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -left-64 w-[600px] h-[600px] animate-[spin_160s_linear_infinite]">
          <Rosette className="w-full h-full text-brand-maroon" opacity={0.08} />
        </div>
        <div className="absolute top-1/2 -right-64 w-[800px] h-[800px] animate-[spin_180s_linear_infinite_reverse]">
          <Rosette className="w-full h-full text-brand-maroon" opacity={0.08} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <Rosette className="w-10 h-10 text-brand-maroon mb-4 animate-[spin_30s_linear_infinite]" opacity={0.8} />
          <h2 className="text-4xl md:text-5xl font-display text-brand-maroon mb-4">La Carte</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-maroon to-transparent opacity-50"></div>
          {!ordering.enabled && ordering.reason && <p className="mt-4 text-xs uppercase tracking-[0.2em] text-brand-maroon/70">{ordering.reason} La carte reste consultable.</p>}
        </div>

        {loading && menu.items.length === 0 && <p className="text-center text-brand-maroon/60 font-serif">Chargement de la carte…</p>}
        {error && <p className="text-center text-red-700 font-serif">{error}</p>}

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`pb-1 text-xs uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${activeCategory === cat.id ? 'text-brand-maroon border-b-2 border-brand-maroon font-bold' : 'text-brand-maroon/50 hover:text-brand-maroon border-b border-transparent'}`}>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className={`group relative bg-white/30 hover:bg-white/60 border border-brand-maroon/10 hover:border-brand-gold/30 transition-all duration-500 rounded-lg overflow-hidden shadow-sm hover:shadow-md ${item.available ? '' : 'opacity-60'}`}>
              {item.image && (
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover filter sepia-[0.2] group-hover:sepia-0 transition-all duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon/20 to-transparent"></div>
                </div>
              )}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-serif text-brand-maroon group-hover:text-brand-maroon-dark transition-colors flex-1 pr-2">{item.name}</h3>
                  <span className="text-xl font-display text-brand-gold font-bold flex-shrink-0">
                    {item.options.some((g) => g.choices.some((ch) => ch.price)) ? <span className="text-xs font-sans text-brand-maroon/60 mr-1">dès</span> : null}
                    {euro(item.price)}
                  </span>
                </div>
                <p className="text-brand-maroon/70 text-sm font-serif leading-relaxed mb-4 min-h-[3rem]">{item.description}</p>
                {!item.available ? (
                  <p className="w-full py-2.5 text-center text-brand-maroon/50 text-xs uppercase tracking-widest border border-brand-maroon/10 rounded">Indisponible aujourd’hui</p>
                ) : ordering.enabled ? (
                  <button onClick={(ev) => handleItemClick(item, ev.currentTarget)} className="w-full py-2.5 bg-brand-maroon hover:bg-brand-maroon-dark text-brand-cream font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 rounded">
                    {item.options.length > 0 ? 'Choisir' : 'Ajouter'} <Plus size={14} />
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)} role="dialog" aria-modal="true">
            <div className="bg-brand-cream rounded-lg max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-display text-brand-maroon">{selectedItem.name}</h3>
                <button onClick={() => setSelectedItem(null)} className="text-brand-maroon hover:text-brand-gold transition-colors" aria-label="Fermer">
                  <X size={24} />
                </button>
              </div>

              {selectedItem.options.map((grp) => (
                <div key={grp.title} className="mb-5">
                  <p className="text-brand-maroon/70 mb-2 font-serif">
                    {grp.title}
                    {grp.required ? '' : ' (optionnel)'}
                    {grp.multiple ? ' · plusieurs choix possibles' : ''}
                  </p>
                  <div className="space-y-2">
                    {grp.choices.map((choice, ci) => {
                      const on = (sel[grp.title] ?? []).includes(ci);
                      return (
                        <button key={`${choice.label}-${ci}`} onClick={() => setSel(pick(sel, grp, ci))} className={`w-full p-3 text-left border-2 rounded transition-all flex justify-between items-center ${on ? 'border-brand-gold bg-brand-gold/10 text-brand-maroon' : 'border-brand-maroon/20 hover:border-brand-gold/50 text-brand-maroon/70'}`}>
                          <span className="font-medium">{choice.label}</span>
                          {choice.price ? <span className="text-brand-gold font-bold">+{euro(choice.price)}</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center mb-4 p-3 bg-brand-maroon/5 rounded-lg">
                <span className="text-sm text-brand-maroon/70">{missing ? 'Faites vos choix' : 'Prêt à ajouter'}</span>
                <span className="text-xl font-display text-brand-gold font-bold">{euro(total)}</span>
              </div>

              <button
                onClick={(ev) => {
                  if (missing) return;
                  add(selectedItem, { unitPrice: total, detail: selectionDetail(selectedItem.options, sel), source: ev.currentTarget });
                  setSelectedItem(null);
                }}
                disabled={missing}
                className={`w-full py-3 font-bold text-sm uppercase tracking-widest transition-all duration-300 rounded ${!missing ? 'bg-brand-maroon hover:bg-brand-maroon-dark text-brand-cream' : 'bg-brand-maroon/30 text-brand-maroon/50 cursor-not-allowed'}`}
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
