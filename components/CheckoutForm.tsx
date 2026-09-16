import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Mail, User, MessageSquare, Package, Truck, CreditCard } from 'lucide-react';
import { euro, startCheckout, toPayloadLines, useCart, validatePromo } from '@kit';

type Form = { name: string; phone: string; email: string; address: string; city: string; zipCode: string; instructions: string };

/** Formulaire de commande intégré à la page (section Contact). Le serveur recalcule tous les prix. */
export const CheckoutForm: React.FC = () => {
  const { lines, subtotal, deliveryFee, total, orderType, setOrderType, settings, ordering, count } = useCart();
  const [f, setF] = useState<Form>({ name: '', phone: '', email: '', address: '', city: 'Nancy', zipCode: '54000', instructions: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');
  const [submitError, setSubmitError] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => nameRef.current?.focus(), []);

  const delivery = orderType === 'delivery';
  const finalTotal = Math.max(0, subtotal - discount) + deliveryFee;
  const belowMin = settings.minOrder > 0 && subtotal < settings.minOrder;

  const validateField = (name: keyof Form, value: string): string => {
    switch (name) {
      case 'name': return value.trim().length < 2 ? 'Le nom doit contenir au moins 2 caractères' : '';
      case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Veuillez saisir un email valide';
      case 'phone': return /^[\d\s+()-]{10,}$/.test(value) ? '' : 'Veuillez saisir un numéro de téléphone valide';
      case 'address': return delivery && value.trim().length < 5 ? "L'adresse doit contenir au moins 5 caractères" : '';
      case 'zipCode':
        if (!delivery) return '';
        if (!/^\d{5}$/.test(value)) return 'Le code postal doit contenir 5 chiffres';
        if (settings.deliveryZips.length > 0 && !settings.deliveryZips.includes(value)) return `Nous ne livrons pas au ${value}`;
        return '';
      case 'city': return delivery && value.trim().length < 2 ? 'Veuillez saisir une ville valide' : '';
      default: return '';
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof Form;
    setF((prev) => ({ ...prev, [name]: e.target.value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: validateField(name, e.target.value) || undefined }));
  };
  const validateForm = (): boolean => {
    const e: Partial<Record<keyof Form, string>> = {};
    (Object.keys(f) as (keyof Form)[]).forEach((k) => {
      if (k === 'instructions') return;
      const err = validateField(k, f[k]);
      if (err) e[k] = err;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const applyPromo = async () => {
    const code = promoCode.trim();
    if (!code) return;
    try {
      const r = await validatePromo(code, subtotal);
      setDiscount(r.discount);
      setPromoMsg(`Code appliqué : ${r.label}`);
    } catch (err) {
      setDiscount(0);
      setPromoMsg(err instanceof Error ? err.message : 'Code invalide.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || belowMin) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const { url } = await startCheckout({
        orderType,
        customer: { name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim() },
        address: delivery ? { line: f.address.trim(), zip: f.zipCode.trim(), city: f.city.trim() } : undefined,
        instructions: f.instructions.trim() || undefined,
        promoCode: promoCode.trim() || undefined,
        lines: toPayloadLines(lines),
      });
      window.location.href = url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  const cls = (k: keyof Form, extra = '') =>
    `w-full ${extra} py-3 border-2 rounded-lg focus:outline-none transition-all ${errors[k] ? 'border-red-500 focus:border-red-500' : f[k] && !errors[k] ? 'border-green-500 focus:border-green-500' : 'border-brand-maroon/20 focus:border-brand-gold'}`;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display text-brand-maroon mb-3">Finaliser ma commande</h2>
        <p className="text-brand-maroon/70 font-serif">Remplissez vos coordonnées pour recevoir votre commande</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {ordering.modes.length > 1 && (
          <div>
            <label className="block text-brand-maroon font-bold text-sm uppercase tracking-wider mb-4">Type de commande</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button type="button" onClick={() => setOrderType('delivery')} className={`p-4 border-2 rounded-lg transition-all text-left ${delivery ? 'border-brand-gold bg-brand-gold/10' : 'border-brand-maroon/20 hover:border-brand-gold/50'}`}>
                <div className="flex items-center gap-3">
                  <Truck size={24} className={delivery ? 'text-brand-gold' : 'text-brand-maroon/50'} />
                  <div>
                    <p className="font-bold text-brand-maroon">Livraison à domicile</p>
                    <p className="text-sm text-brand-maroon/60">{settings.deliveryFee > 0 ? `+${euro(settings.deliveryFee)}` : 'Offerte'}{settings.freeDeliveryOver != null ? ` · offerte dès ${euro(settings.freeDeliveryOver)}` : ''}</p>
                  </div>
                </div>
              </button>
              <button type="button" onClick={() => setOrderType('pickup')} className={`p-4 border-2 rounded-lg transition-all text-left ${!delivery ? 'border-brand-gold bg-brand-gold/10' : 'border-brand-maroon/20 hover:border-brand-gold/50'}`}>
                <div className="flex items-center gap-3">
                  <Package size={24} className={!delivery ? 'text-brand-gold' : 'text-brand-maroon/50'} />
                  <div>
                    <p className="font-bold text-brand-maroon">À emporter</p>
                    <p className="text-sm text-brand-maroon/60">Gratuit</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-brand-maroon font-bold text-sm uppercase tracking-wider mb-4">Coordonnées</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-brand-maroon font-bold text-sm mb-2">Nom complet *</label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-maroon/40" />
                <input ref={nameRef} type="text" id="name" name="name" value={f.name} onChange={handleChange} placeholder="Jean Dupont" autoComplete="name" className={cls('name', 'pl-10 pr-4')} />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-brand-maroon font-bold text-sm mb-2">Téléphone *</label>
              <div className="relative">
                <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-maroon/40" />
                <input type="tel" id="phone" name="phone" value={f.phone} onChange={handleChange} placeholder="06 12 34 56 78" autoComplete="tel" className={cls('phone', 'pl-10 pr-4')} />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-brand-maroon font-bold text-sm mb-2">Email *</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-maroon/40" />
                <input type="email" id="email" name="email" value={f.email} onChange={handleChange} placeholder="email@exemple.com" autoComplete="email" className={cls('email', 'pl-10 pr-4')} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>
        </div>

        {delivery && (
          <div>
            <h3 className="text-brand-maroon font-bold text-sm uppercase tracking-wider mb-4">Adresse de livraison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-brand-maroon font-bold text-sm mb-2">Adresse complète *</label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-maroon/40" />
                  <input type="text" id="address" name="address" value={f.address} onChange={handleChange} placeholder="21 Rue des Maréchaux" autoComplete="street-address" className={cls('address', 'pl-10 pr-4')} />
                </div>
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-brand-maroon font-bold text-sm mb-2">Code postal *</label>
                <input type="text" id="zipCode" name="zipCode" value={f.zipCode} onChange={handleChange} placeholder="54000" maxLength={5} autoComplete="postal-code" className={cls('zipCode', 'px-4')} />
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
              </div>
              <div>
                <label htmlFor="city" className="block text-brand-maroon font-bold text-sm mb-2">Ville *</label>
                <input type="text" id="city" name="city" value={f.city} onChange={handleChange} placeholder="Nancy" autoComplete="address-level2" className={cls('city', 'px-4')} />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="instructions" className="block text-brand-maroon font-bold text-sm mb-2">Instructions spéciales (optionnel)</label>
          <div className="relative">
            <MessageSquare size={20} className="absolute left-3 top-3 text-brand-maroon/40" />
            <textarea id="instructions" name="instructions" value={f.instructions} onChange={handleChange} placeholder="Digicode, étage, préférences..." rows={3} className="w-full pl-10 pr-4 py-3 border-2 border-brand-maroon/20 rounded-lg focus:outline-none focus:border-brand-gold transition-all resize-none" />
          </div>
        </div>

        <div>
          <label htmlFor="promoCode" className="block text-brand-maroon font-bold text-sm mb-2">Code promo (optionnel)</label>
          <div className="flex gap-3">
            <input type="text" id="promoCode" name="promoCode" value={promoCode} onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoMsg(''); }} placeholder="EX : BIENVENUE10" className="flex-1 px-4 py-3 border-2 border-brand-maroon/20 rounded-lg focus:outline-none focus:border-brand-gold transition-all uppercase" />
            <button type="button" onClick={() => void applyPromo()} className="px-5 border-2 border-brand-maroon/20 rounded-lg text-brand-maroon font-bold text-xs uppercase tracking-wider hover:border-brand-gold">Appliquer</button>
          </div>
          {promoMsg && <p className={`text-sm mt-2 ${discount > 0 ? 'text-green-700' : 'text-red-600'}`}>{promoMsg}</p>}
        </div>

        <div className="bg-brand-maroon/5 border border-brand-gold/20 rounded-lg p-6">
          <h3 className="text-brand-maroon font-bold text-sm uppercase tracking-wider mb-4">Résumé de la commande</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-brand-maroon/70">{count} article(s)</span><span className="font-display text-brand-maroon font-bold">{euro(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-sm text-green-700"><span>Remise</span><span>−{euro(discount)}</span></div>}
            {delivery && <div className="flex justify-between text-sm"><span className="text-brand-maroon/70">Frais de livraison</span><span className="font-display text-brand-maroon font-bold">{deliveryFee > 0 ? euro(deliveryFee) : 'Offerts'}</span></div>}
            <div className="h-px bg-brand-maroon/10 my-3"></div>
            <div className="flex justify-between"><span className="text-lg font-display text-brand-maroon font-bold">Total</span><span className="text-2xl font-display text-brand-gold font-bold">{euro(finalTotal)}</span></div>
          </div>
        </div>

        {belowMin && <p className="text-red-600 text-sm">Minimum de commande : {euro(settings.minOrder)}.</p>}
        {submitError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{submitError}</p>}

        <button type="submit" disabled={isSubmitting || belowMin} className={`w-full py-4 bg-brand-maroon hover:bg-brand-maroon-dark text-brand-cream font-bold text-sm uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${isSubmitting || belowMin ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-brand-cream border-t-transparent rounded-full animate-spin"></div>
              <span>Traitement en cours...</span>
            </>
          ) : (
            <>
              <CreditCard size={20} />
              <span>Payer par carte bancaire · {euro(finalTotal)}</span>
            </>
          )}
        </button>
        <p className="text-center text-xs text-brand-maroon/50">Paiement sécurisé par Stripe.</p>
      </form>
    </div>
  );
};
