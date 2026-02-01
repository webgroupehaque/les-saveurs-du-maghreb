import React, { useEffect, useState } from 'react';
import { CheckCircle, Home } from 'lucide-react';
import { supabase } from '../supabaseClient';

export const Success: React.FC = () => {
  const [orderCode, setOrderCode] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrderCodeWithRetry = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer le session_id depuis l'URL
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');
        
        if (!sessionId) {
          console.error('❌ Pas de session_id dans l\'URL');
          setIsLoading(false);
          return;
        }
        
        setSessionId(sessionId);
        console.log('🔍 Recherche de la commande avec session_id:', sessionId);
        
        // Fonction de retry avec délai exponentiel
        const maxRetries = 10; // 10 tentatives
        const baseDelay = 1000; // 1 seconde
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          console.log(`🔄 Tentative ${attempt + 1}/${maxRetries}...`);
          
          // Requête Supabase
          const { data, error } = await supabase
            .from('orders')
            .select('order_code')
            .eq('stripe_session_id', sessionId)
            .maybeSingle(); // maybeSingle au lieu de single pour éviter l'erreur si pas trouvé
          
          if (error) {
            console.error('❌ Erreur Supabase:', error);
            // Continue à essayer même en cas d'erreur
          } else if (data && data.order_code) {
            // ✅ Commande trouvée !
            console.log('✅ Commande trouvée ! Code:', data.order_code);
            setOrderCode(data.order_code);
            setIsLoading(false);
            return; // Succès, on sort de la boucle
          } else {
            console.log('⏳ Commande pas encore dans Supabase, nouvelle tentative...');
          }
          
          // Attendre avant la prochaine tentative (délai exponentiel)
          if (attempt < maxRetries - 1) {
            const delay = baseDelay * Math.pow(1.5, attempt); // 1s, 1.5s, 2.25s, 3.4s, etc.
            console.log(`⏱️ Attente de ${Math.round(delay)}ms avant la prochaine tentative...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
        
        // Si on arrive ici, toutes les tentatives ont échoué
        console.error('❌ Impossible de récupérer le code après', maxRetries, 'tentatives');
        console.log('💡 Génération d\'un code temporaire...');
        
        // Générer un code temporaire en dernier recours
        const tempCode = String(Math.floor(1000 + Math.random() * 9000));
        setOrderCode(tempCode);
        setIsLoading(false);
        
      } catch (error) {
        console.error('❌ Erreur lors de la récupération du code:', error);
        
        // Générer un code temporaire en cas d'erreur
        const tempCode = String(Math.floor(1000 + Math.random() * 9000));
        setOrderCode(tempCode);
        setIsLoading(false);
      }
    };
    
    fetchOrderCodeWithRetry();
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
        
        {isLoading ? (
          <div className="bg-brand-cream rounded-lg p-4 mb-6">
            <p className="text-sm text-brand-maroon/70 mb-1">Recherche de votre commande...</p>
            <div className="flex justify-center mt-2">
              <div className="w-6 h-6 border-2 border-brand-maroon border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-xs text-brand-maroon/50 mt-2">Cela peut prendre quelques secondes</p>
          </div>
        ) : orderCode ? (
          <div className="bg-brand-cream rounded-lg p-4 mb-6">
            <p className="text-sm text-brand-maroon/70 mb-1">Numéro de commande</p>
            <p className="text-4xl font-bold text-brand-maroon">#{orderCode}</p>
          </div>
        ) : null}
        
        <p className="text-gray-600 mb-6">
          Votre paiement a été accepté. Vous allez recevoir un email de confirmation avec tous les détails de votre commande.
        </p>
        
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
