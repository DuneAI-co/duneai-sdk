/**
 * src/morph.ts
 * Simple DOM morphing: read inline variants or apply remote active variant
 */

export type Variant = {
  id: string;
  text?: string;
  color?: string;
  style?: { [k: string]: string };
};

export type Rule = {
  name: string; // data-morph name
  selector?: string; // optional selector override
  active?: string; // active variant id
  variants?: Variant[];
};

export function applyVariantToElement(el: HTMLElement, v: Variant) {
  if (!el || !v) return;
  if (v.text !== undefined) {
    if (!el.dataset['duneOriginalText']) el.dataset['duneOriginalText'] = el.innerHTML;
    el.innerHTML = v.text;
  }
  if (v.color) {
    if (!el.dataset['duneOriginalBg']) el.dataset['duneOriginalBg'] = el.style.background || '';
    el.style.background = v.color;
  }
  if (v.style) {
    for (const key in v.style) {
      (el.style as any)[key] = v.style[key];
    }
  }
  if (v.id) el.setAttribute('data-variant', v.id);
}

function parseInlineVariants(el: HTMLElement): Variant[] | null {
  const raw = el.getAttribute('data-variants');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Variant[];
  } catch (e) {
    // ignore
  }
  return null;
}

export function applyAllRules(rules: Rule[]) {
  // convert rule name -> active id map
  const map = new Map<string, string | undefined>();
  for (const r of rules) map.set(r.name, r.active);

  const nodes = document.querySelectorAll<HTMLElement>('[data-morph]');
  nodes.forEach((node) => {
    const name = node.getAttribute('data-morph') || '';
    const inline = parseInlineVariants(node);
    const activeId = map.get(name);
    if (activeId && inline) {
      const v = inline.find(x => x.id === activeId);
      if (v) {
        applyVariantToElement(node, v);
        return;
      }
    }
    // fallback: if inline variants exist, pick deterministic default index
    if (inline && inline.length) {
      const index = Math.abs(hashString(location.pathname + name)) % inline.length;
      applyVariantToElement(node, inline[index]);
    }
  });
}

function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}
