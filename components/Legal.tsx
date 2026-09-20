import React, { useState } from 'react';
import { legalPages, useCart, useRestaurant } from '@kit';
import { useSiteContent } from '../lib/content';

/**
 * Pages légales (mentions, confidentialité, conditions de vente).
 * Le site est d'une seule page : ces documents s'affichent à la place du
 * contenu quand l'adresse est /mentions-legales, /confidentialite ou /cgv.
 * Les textes viennent des réglages et des contenus saisis dans l'app Rekvo.
 */
export type Doc = 'mentions' | 'confidentialite' | 'cgv';
const CHEMINS: Record<Doc, string> = { mentions: '/mentions-legales', confidentialite: '/confidentialite', cgv: '/cgv' };
const ONGLETS: [Doc, string][] = [['mentions', 'Mentions légales'], ['confidentialite', 'Confidentialité'], ['cgv', 'Conditions de vente']];

export function docFromPath(pathname = window.location.pathname): Doc | null {
  const trouve = (Object.entries(CHEMINS) as [Doc, string][]).find(([, p]) => p === pathname);
  return trouve ? trouve[0] : null;
}

export const Legal: React.FC<{ doc: Doc; onClose: () => void }> = ({ doc, onClose }) => {
  const [actif, setActif] = useState<Doc>(doc);
  const { settings } = useCart();
  const restaurant = useRestaurant('Les Saveurs du Maghreb');
  const { values } = useSiteContent();
  const page = legalPages(restaurant, settings, values)[actif];

  const ouvrir = (d: Doc) => {
    setActif(d);
    window.history.pushState(null, '', CHEMINS[d]);
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="bg-brand-cream text-brand-maroon min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <button
          onClick={() => { window.history.pushState(null, '', '/'); onClose(); }}
          className="text-sm text-brand-maroon/70 hover:text-brand-maroon mb-8"
        >
          ← Retour au site
        </button>
        <div className="flex flex-wrap gap-2 mb-10">
          {ONGLETS.map(([d, libelle]) => (
            <button
              key={d}
              onClick={() => ouvrir(d)}
              className={`px-4 py-2 rounded-full text-sm transition ${actif === d ? 'bg-brand-maroon text-brand-cream' : 'border border-brand-maroon/30 hover:border-brand-maroon'}`}
            >
              {libelle}
            </button>
          ))}
        </div>
        <h1 className="font-serif text-3xl md:text-4xl mb-8">{page.title}</h1>
        {page.sections.map((s) => (
          <section key={s.title} className="mb-8">
            <h2 className="font-serif text-xl mb-3">{s.title}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className={`text-sm leading-relaxed mb-2 ${p.includes('[à compléter') ? 'text-red-700' : 'text-brand-maroon/80'}`}>
                {p}
              </p>
            ))}
          </section>
        ))}
        <p className="text-xs text-brand-maroon/50 mt-10">Modèles fournis par Rekvo, à faire relire : ce n'est pas un conseil juridique.</p>
      </div>
    </main>
  );
};
