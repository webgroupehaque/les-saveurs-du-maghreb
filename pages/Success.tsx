import React, { useEffect, useState } from 'react';
import { CheckCircle, Home } from 'lucide-react';

export const Success: React.FC = () => {
  const [orderCode, setOrderCode] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  useEffect(() => {
    // Récupérer session_id depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('session_id');
    setSessionId(id);
    
    // Générer un code de commande temporaire (sera remplacé par le vrai code depuis Supabase)
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setOrderCode(code);
  }, []);
  
  useEffect(() => {
    // Générer un code de commande temporaire (sera remplacé par le vrai code depuis Supabase)
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setOrderCode(code);
  }, []);
  
  const handleGoHome = () => {
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
        
        {orderCode && (
          <div className="bg-brand-cream rounded-lg p-4 mb-6">
            <p className="text-sm text-brand-maroon/70 mb-1">Numéro de commande</p>
            <p className="text-4xl font-bold text-brand-maroon">#{orderCode}</p>
          </div>
        )}
        
        <p className="text-gray-600 mb-6">
          Votre paiement a été accepté. Vous allez recevoir un email de confirmation avec tous les détails de votre commande.
        </p>
        
        {sessionId && (
          <p className="text-xs text-gray-500 mb-6">
            Session ID: {sessionId.substring(0, 20)}...
          </p>
        )}
        
        <button
          onClick={handleGoHome}
          className="inline-flex items-center gap-2 bg-brand-maroon text-white px-6 py-3 rounded-lg hover:bg-brand-maroon-dark transition-colors"
        >
          <Home className="w-5 h-5" />
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};
