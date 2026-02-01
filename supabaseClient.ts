import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validation des variables d'environnement
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL n\'est pas défini. Vérifiez votre fichier .env.local');
}

if (!supabaseKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY n\'est pas défini. Vérifiez votre fichier .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
