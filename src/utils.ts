/**
 * src/utils.ts
 */

import type { Rule } from './morph';

export function now() { return Date.now(); }

// const DEFAULT_RULES_ENDPOINT = 'https://api.duneai.co/api/rules';
const DEFAULT_RULES_ENDPOINT = process.env.NEXT_PUBLIC_RULES_ENDPOINT || 'http://localhost:3000/api/rules';


export async function fetchRules(siteId: string, endpoint?: string): Promise<{ variants: Rule[] } | null> {
  const url = (endpoint || DEFAULT_RULES_ENDPOINT) + '?site=' + encodeURIComponent(siteId);
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error('bad rules response');
    const json = await res.json();
    return json;
  } catch (e) {
    // swallow for POC
    return null;
  }
}
