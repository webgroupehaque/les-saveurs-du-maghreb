import React, { useEffect, useState } from 'react';
import { CheckCircle, Home } from 'lucide-react';

export const Success: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  useEffect(() => {
    // Juste récupérer le session_id pour confirmation
    const params = new URLSearchParams(window.location.search);
    const sessionIdParam = params.get('session_id');
    
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }
  }, []);
  
  const handleReturnHome = () => {
    window.location.href = '/';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-maroon/10 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </div>
        
        <h1 className="font-serif text-3xl text-brand-maroon mb-4">
          Commande Confirmée !
        </h1>
        
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
          <div className="text-center">
            <p className="text-lg font-bold text-green-700 mb-2">
              ✅ Paiement validé !
            </p>
            <p className="text-gray-700">
              Votre commande a été confirmée et transmise au restaurant.
            </p>
          </div>
        </div>

        <div className="bg-brand-cream rounded-lg p-6 mb-6 border-2 border-brand-maroon/20">
          <p className="text-center text-brand-maroon font-bold text-lg mb-2">
            📧 Consultez vos emails
          </p>
          <p className="text-center text-gray-600 text-sm">
            Votre <strong>numéro de commande</strong> et tous les détails vous ont été envoyés par email.
          </p>
          <p className="text-center text-gray-500 text-xs mt-2">
            Vérifiez également vos spams si vous ne le trouvez pas.
          </p>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">
          Merci de votre confiance !<br/>
          <strong>Les Saveurs du Maghreb</strong>
        </p>
        
        <button
          onClick={handleReturnHome}
          className="inline-flex items-center gap-2 bg-brand-maroon text-white px-6 py-3 rounded-lg hover:bg-brand-maroon-dark transition-colors"
        >
          <Home className="w-5 h-5" />
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};
