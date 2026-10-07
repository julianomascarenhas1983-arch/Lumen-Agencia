import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';

export type Language = 'pt' | 'en';

export const translations = {
  pt: ptBR,
  en: enUS,
};

// Helper for nested property access (e.g. 'nav.home' -> translations.pt.nav.home)
export function getTranslation(lang: Language, key: string, fallback?: string): string {
  const dict = translations[lang] || translations.pt;
  const parts = key.split('.');
  let current: any = dict;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to pt dictionary if not found in en
      let fallbackCurrent: any = translations.pt;
      for (const fPart of parts) {
        if (fallbackCurrent && typeof fallbackCurrent === 'object' && fPart in fallbackCurrent) {
          fallbackCurrent = fallbackCurrent[fPart];
        } else {
          return fallback || key;
        }
      }
      return typeof fallbackCurrent === 'string' ? fallbackCurrent : fallback || key;
    }
  }

  return typeof current === 'string' ? current : fallback || key;
}

// Format price strictly according to the language and fixed currency rules:
// - Portuguese: R$ X.XXX (BRL)
// - English: $X,XXX (fixed USD, no automatic cents or live exchange rates)
export function formatCurrencyPrice(
  lang: Language,
  priceBRL: number,
  priceUSD?: number
): string {
  if (lang === 'en') {
    // Fixed USD price (from catalog or rounded estimate)
    const val = typeof priceUSD === 'number' && priceUSD > 0 ? priceUSD : Math.round(priceBRL / 5);
    return `$${val.toLocaleString('en-US')}`;
  }
  return `R$ ${priceBRL.toLocaleString('pt-BR')}`;
}
