import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, User, MessageSquare, Package, Truck, CreditCard } from 'lucide-react';
import { DeliveryInfo, CartItem } from '../types';

interface CheckoutFormProps {
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  onSubmit: (deliveryInfo: DeliveryInfo) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cartItems,
  subtotal,
  deliveryFee,
  total,
  onSubmit
}) => {
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Nancy',
    zipCode: '54000',
    instructions: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus automatique sur le premier champ
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Validation helpers
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const cleanedPhone = phone.replace(/\s/g, '');
    const phoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(cleanedPhone) && cleanedPhone.length >= 10;
  };

  const validateZipCode = (zipCode: string): boolean => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zipCode);
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (value.length < 2) {
          return 'Le nom doit contenir au moins 2 caractères';
        }
        break;
      case 'email':
        if (!validateEmail(value)) {
          return 'Veuillez saisir un email valide';
        }
        break;
      case 'phone':
        if (!validatePhone(value)) {
          return 'Veuillez saisir un numéro de téléphone valide (10 chiffres)';
        }
        break;
      case 'address':
        if (orderType === 'delivery' && value.length < 5) {
          return 'L\'adresse doit contenir au moins 5 caractères';
        }
        break;
      case 'zipCode':
        if (orderType === 'delivery' && !validateZipCode(value)) {
          return 'Le code postal doit contenir 5 chiffres';
        }
        break;
      case 'city':
        if (orderType === 'delivery' && value.length < 2) {
          return 'Veuillez saisir une ville valide';
        }
        break;
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validation en temps réel
    if (formErrors[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[name] = error;
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    // Validation de tous les champs
    Object.keys(formData).forEach(key => {
      if (key === 'instructions') return; // Optionnel
      
      if (orderType === 'takeaway' && (key === 'address' || key === 'zipCode' || key === 'city')) {
        return; // Pas nécessaire pour emporter
      }
      
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        errors[key] = error;
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const deliveryInfo: DeliveryInfo = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: orderType === 'delivery' ? formData.address : '',
        city: orderType === 'delivery' ? formData.city : 'Nancy',
        zipCode: orderType === 'delivery' ? formData.zipCode : '54000',
        orderType: orderType,
        instructions: formData.instructions || ''
      };
      
      onSubmit(deliveryInfo);
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalTotal = orderType === 'delivery' ? total : subtotal;
  const finalDeliveryFee = orderType === 'delivery' ? deliveryFee : 0;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display text-brand-maroon mb-3">
          Finaliser ma commande
        </h2>
        <p className="text-brand-maroon/70 font-serif">
          Remplissez vos coordonnées pour recevoir votre commande
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Type de commande */}
        <div>
          <label className="block text-brand-maroon font-bold text-sm uppercase tracking-wider mb-4">
            Type de commande
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setOrderType('delivery')}
              className={`p-4 border-2 rounded-lg transition-all text-left ${
                orderType === 'delivery'
                  ? 'border-brand-gold bg-brand-gold/10'
                  : 'border-brand-maroon/20 hover:border-brand-gold/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck size={24} className={orderType === 'delivery' ? 'text-brand-gold' : 'text-brand-maroon/50'} />
                <div>
                  <p className="font-bold text-brand-maroon">Livraison à domicile</p>
                  <p className="text-sm text-brand-maroon/60">+2,50€</p>
                </div>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setOrderType('takeaway')}
              className={`p-4 border-2 rounded-lg transition-all text-left ${
                orderType === 'takeaway'
                  ? 'border-brand-gold bg-brand-gold/10'
                  : 'border-brand-maroon/20 hover:border-brand-gold/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package size={24} className={orderType === 'takeaway' ? 'text-brand-gold' : 'text-brand-maroon/50'} />
                <div>
                  <p className="font-bold text-brand-maroon">À emporter</p>
                  <p className="text-sm text-brand-maroon/60">Gratuit</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Coordonnées */}
        <div>
          <h3 className="text-brand-maroon font-bold text-sm uppercase tracking-wider mb-4">
            Coordonnées
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-brand-maroon font-bold text-sm mb-2">
                Nom complet *
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-maroon/40" />
                <input
                  ref={nameInputRef}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                    formErrors.name
                      ? 'border-red-500 focus:border-red-500'
                      : formData.name && !formErrors.name
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-brand-maroon/20 focus:border-brand-gold'
                  }`}
                />
              </div>
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-brand-maroon font-bold text-sm mb-2">
                Téléphone *
              </label>
              <div className="relative">
                <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-maroon/40" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                    formErrors.phone
                      ? 'border-red-500 focus:border-red-500'
                      : formData.phone && !formErrors.phone
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-brand-maroon/20 focus:border-brand-gold'
                  }`}
                />
              </div>
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-brand-maroon font-bold text-sm mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-maroon/40" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@exemple.com"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                    formErrors.email
                      ? 'border-red-500 focus:border-red-500'
                      : formData.email && !formErrors.email
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-brand-maroon/20 focus:border-brand-gold'
                  }`}
                />
              </div>
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Adresse (si livraison) */}
        {orderType === 'delivery' && (
          <div>
            <h3 className="text-brand-maroon font-bold text-sm uppercase tracking-wider mb-4">
              Adresse de livraison
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Adresse complète */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-brand-maroon font-bold text-sm mb-2">
                  Adresse complète *
                </label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-maroon/40" />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="21 Rue des Maréchaux"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                      formErrors.address
                        ? 'border-red-500 focus:border-red-500'
                        : formData.address && !formErrors.address
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-brand-maroon/20 focus:border-brand-gold'
                    }`}
                  />
                </div>
                {formErrors.address && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                )}
              </div>

              {/* Code postal */}
              <div>
                <label htmlFor="zipCode" className="block text-brand-maroon font-bold text-sm mb-2">
                  Code postal *
                </label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-maroon/40" />
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="54000"
                    maxLength={5}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                      formErrors.zipCode
                        ? 'border-red-500 focus:border-red-500'
                        : formData.zipCode && !formErrors.zipCode
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-brand-maroon/20 focus:border-brand-gold'
                    }`}
                  />
                </div>
                {formErrors.zipCode && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.zipCode}</p>
                )}
              </div>

              {/* Ville */}
              <div>
                <label htmlFor="city" className="block text-brand-maroon font-bold text-sm mb-2">
                  Ville *
                </label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-maroon/40" />
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Nancy"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                      formErrors.city
                        ? 'border-red-500 focus:border-red-500'
                        : formData.city && !formErrors.city
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-brand-maroon/20 focus:border-brand-gold'
                    }`}
                  />
                </div>
                {formErrors.city && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div>
          <label htmlFor="instructions" className="block text-brand-maroon font-bold text-sm mb-2">
            Instructions spéciales (optionnel)
          </label>
          <div className="relative">
            <MessageSquare size={20} className="absolute left-3 top-3 text-brand-maroon/40" />
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Digicode, étage, préférences..."
              rows={3}
              className="w-full pl-10 pr-4 py-3 border-2 border-brand-maroon/20 rounded-lg focus:outline-none focus:border-brand-gold transition-all resize-none"
            />
          </div>
        </div>

        {/* Résumé de la commande */}
        <div className="bg-brand-maroon/5 border border-brand-gold/20 rounded-lg p-6">
          <h3 className="text-brand-maroon font-bold text-sm uppercase tracking-wider mb-4">
            Résumé de la commande
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-brand-maroon/70">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} article(s)
              </span>
              <span className="font-display text-brand-maroon font-bold">
                {subtotal.toFixed(2).replace('.', ',')}€
              </span>
            </div>
            {orderType === 'delivery' && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-maroon/70">Frais de livraison</span>
                <span className="font-display text-brand-maroon font-bold">
                  {deliveryFee.toFixed(2).replace('.', ',')}€
                </span>
              </div>
            )}
            <div className="h-px bg-brand-maroon/10 my-3"></div>
            <div className="flex justify-between">
              <span className="text-lg font-display text-brand-maroon font-bold">Total</span>
              <span className="text-2xl font-display text-brand-gold font-bold">
                {finalTotal.toFixed(2).replace('.', ',')}€
              </span>
            </div>
          </div>
        </div>

        {/* Bouton Submit */}
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(formErrors).length > 0}
          className={`w-full py-4 bg-brand-maroon hover:bg-brand-maroon-dark text-brand-cream font-bold text-sm uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
            isSubmitting || Object.keys(formErrors).length > 0
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-brand-cream border-t-transparent rounded-full animate-spin"></div>
              <span>Traitement en cours...</span>
            </>
          ) : (
            <>
              <CreditCard size={20} />
              <span>Payer par carte bancaire</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
