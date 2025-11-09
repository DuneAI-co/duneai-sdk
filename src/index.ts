/**
 * src/index.ts
 * Public entry for DuneAI SDK
 */

import { initTracker, sendEvent } from './tracker';
import { applyAllRules } from './morph';
import { fetchRules } from './utils';

// If loaded as ESM (npm usage), user will call init() manually.
// If loaded via <script> IIFE (CDN), auto-init from data attribute.

export type DuneOptions = {
  siteId: string;
  rulesEndpoint?: string; // optional override
  eventEndpoint?: string;
  debug?: boolean;
};

let _initialized = false;

export async function init(opts: DuneOptions) {
  if (_initialized) return;
  _initialized = true;
  if (opts.debug) console.debug('[Dune] init', opts);

  // fetch server rules (try, but do not block applying inline)
  try {
    const rules = await fetchRules(opts.siteId, opts.rulesEndpoint);
    if (rules && rules.variants) {
      applyAllRules(rules.variants);
    }
  } catch (e) {
    if (opts.debug) console.warn('[Dune] fetch rules failed', e);
  }

  // wire tracker to send events to default endpoint
  //initTracker({ siteId: opts.siteId, eventEndpoint: opts.eventEndpoint, debug: opts.debug });

  const script = document.currentScript as HTMLScriptElement;
const siteId = script?.dataset.site || 'default';
const endpoint = script?.dataset.endpoint;

initTracker({
  siteId,
  eventEndpoint: endpoint, // 👈 use this if provided
});
}

// Auto-init when loaded via <script src="..."> with data-site attribute.
declare global {
  interface Window { DuneAI?: { init: (opts: DuneOptions) => Promise<void> } }
}

if (typeof window !== 'undefined') {
  // expose API
  window.DuneAI = {
    init: (opts: DuneOptions) => init(opts)
  };

  // auto init if script tag has data-site
  try {
    const script = document.currentScript as HTMLScriptElement | null;
    const datasetId = script?.getAttribute('data-site') || script?.getAttribute('data-site-id') || undefined;
    if (datasetId) {
      // use a short timeout so pages can set up inline variant definitions
      setTimeout(() => {
        init({ siteId: datasetId });
      }, 200);
    }
  } catch (e) {
    // ignore
  }
}

export { sendEvent };
