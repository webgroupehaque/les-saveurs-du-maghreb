import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { fetchReceipt, readPaymentResult, readPaymentSession, useCart, type OrderReceipt } from '@kit';

/** Message au retour de Stripe (?paiement=reussi | annule). Le panier n'est vidé qu'en cas de succès. */
export const PaymentResult: React.FC = () => {
  const { clear } = useCart();
  const [status, setStatus] = useState<'reussi' | 'annule' | null>(null);
  // Le code de commande, affiché tout de suite : le client n'attend pas son e-mail.
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  useEffect(() => {
    const session = readPaymentSession();
    const p = readPaymentResult();
    if (!p) return;
    setStatus(p);
    if (p === 'reussi') {
      clear();
      if (session) fetchReceipt(session).then(setReceipt);
    }
  }, [clear]);
  if (!status) return null;
  const ok = status === 'reussi';
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={() => setStatus(null)} />
      <div className="relative max-w-md w-full bg-brand-cream rounded-lg p-8 shadow-2xl text-center border border-brand-gold/30">
        {ok ? <CheckCircle size={56} className="text-green-600 mx-auto mb-4" /> : <XCircle size={56} className="text-red-500 mx-auto mb-4" />}
        <h2 className="text-3xl font-display text-brand-maroon mb-3">{ok ? 'Commande confirmée !' : 'Paiement annulé'}</h2>
        <p className="text-brand-maroon/70 font-serif mb-6">
          {ok
            ? 'Votre paiement a été effectué avec succès. Vous recevrez un e-mail de confirmation avec votre code de commande. Le restaurant prépare votre commande.'
            : 'Aucun montant n’a été débité. Votre panier est conservé.'}
        </p>
        {ok && receipt ? (
          <div className="mb-6 rounded-lg border border-current/25 px-5 py-4 opacity-95">
            <p className="text-xs uppercase tracking-[0.2em] opacity-60">Votre code de commande</p>
            <p className="my-1 text-3xl font-bold tracking-[0.18em]">{receipt.code}</p>
            <p className="text-xs opacity-60">
              {receipt.orderType === 'delivery' ? `Livraison estimée dans ${receipt.eta} minutes environ` : `Prête dans ${receipt.eta} minutes environ`}
            </p>
          </div>
        ) : null}
        <button onClick={() => setStatus(null)} className="w-full py-3 bg-brand-maroon hover:bg-brand-maroon-dark text-brand-cream font-bold text-sm uppercase tracking-widest rounded-lg transition-colors">
          {ok ? "Retour à l'accueil" : 'Fermer'}
        </button>
      </div>
    </div>
  );
};
