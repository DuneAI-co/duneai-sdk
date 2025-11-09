/**
 * src/tracker.ts
 * Queue events to localStorage and flush to API
 */
import { now } from './utils';

type TrackerOpts = {
  siteId: string;
  eventEndpoint?: string | undefined;
  debug?: boolean;
};
const DEFAULT_EVENT_ENDPOINT = 'http://localhost:3000/api/event';
const QUEUE_KEY = 'duneai_event_queue_v1';
let optsGlobal: TrackerOpts | null = null;

function loadQueue(): any[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
function saveQueue(q: any[]) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); } catch (e) {}
}

export function initTracker(opts: TrackerOpts) {
  optsGlobal = opts;
  // listen to clicks on [data-morph] elements
  document.addEventListener('click', (ev) => {
    const el = (ev.target as HTMLElement).closest('[data-morph]');
    if (!el) return;
    const name = el.getAttribute('data-morph') || 'unknown';
    const variantId = el.getAttribute('data-variant') || null;
    const payload = {
      siteId: opts.siteId,
      element: name,
      variantId,
      event: 'click',
      url: location.href,
      ts: now()
    };
    queueEvent(payload);
  }, { passive: true });

  // flush periodically
  setInterval(flushQueue, 4000);

  // flush on online
  window.addEventListener('online', flushQueue);
}

export function queueEvent(payload: any) {
  const q = loadQueue();
  q.push({ payload, attempts: 0 });
  saveQueue(q);
}

async function postEvent(evt: any, endpoint: string) {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evt)
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function flushQueue() {
  if (!navigator.onLine) return;
  const q = loadQueue();
  if (!q.length) return;
  const endpoint = optsGlobal?.eventEndpoint || DEFAULT_EVENT_ENDPOINT;
  const remaining: any[] = [];
  for (const item of q) {
    try {
      const ok = await postEvent(item.payload, endpoint);
      if (!ok) {
        item.attempts = (item.attempts || 0) + 1;
        if (item.attempts < 5) remaining.push(item);
      }
    } catch (e) {
      item.attempts = (item.attempts || 0) + 1;
      if (item.attempts < 5) remaining.push(item);
    }
  }
  saveQueue(remaining);
}

export function sendEvent(name: string, variantId?: string | null) {
  if (!optsGlobal) return;
  const payload = {
    siteId: optsGlobal.siteId,
    element: name,
    variantId: variantId || null,
    event: 'manual',
    url: location.href,
    ts: now()
  };
  queueEvent(payload);
}

