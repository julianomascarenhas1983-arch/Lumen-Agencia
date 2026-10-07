export const handler = async (event: any, context: any) => {
  let country = 'BR';

  // 1. Check Netlify context.geo
  if ((context as any)?.geo?.country?.code) {
    country = (context as any).geo.country.code;
  }

  // 2. Check x-nf-geo header (base64 encoded JSON on Netlify)
  const nfGeo = event.headers['x-nf-geo'];
  if (nfGeo) {
    try {
      const decoded = Buffer.from(nfGeo, 'base64').toString('utf-8');
      const parsed = JSON.parse(decoded);
      if (parsed?.country?.code) {
        country = parsed.country.code;
      }
    } catch {
      // ignore
    }
  }

  // 3. Fallback headers from reverse proxies (Cloudflare, etc.)
  const altCountry = event.headers['cf-ipcountry'] || event.headers['x-country-code'];
  if (altCountry && typeof altCountry === 'string' && altCountry.length === 2) {
    country = altCountry.toUpperCase();
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
    body: JSON.stringify({
      country,
      isBrazil: country === 'BR',
      suggestedLang: country === 'BR' ? 'pt' : 'en',
    }),
  };
};
