interface CacheSlot<T> {
  data: T | undefined;
  inflight: Promise<T> | null;
}

const slots = new Map<string, CacheSlot<unknown>>();

function slot<T>(key: string): CacheSlot<T> {
  let s = slots.get(key) as CacheSlot<T> | undefined;
  if (!s) {
    s = { data: undefined, inflight: null };
    slots.set(key, s as CacheSlot<unknown>);
  }
  return s;
}

export interface ListCache<T> {
  get: () => T | null;
  set: (data: T) => void;
  clear: () => void;
  fetch: (fetcher: () => Promise<T>) => Promise<T>;
}

export function getListCache<T>(key: string): ListCache<T> {
  const s = slot<T>(key);
  return {
    get: () => (s.data === undefined ? null : s.data),
    set: (data) => {
      s.data = data;
    },
    clear: () => {
      s.data = undefined;
      s.inflight = null;
    },
    fetch: (fetcher) => {
      if (s.inflight) return s.inflight;
      const p = fetcher()
        .then((d) => {
          s.data = d;
          return d;
        })
        .finally(() => {
          s.inflight = null;
        });
      s.inflight = p;
      return p;
    },
  };
}

export function clearListCaches(): void {
  slots.forEach((s) => {
    s.data = undefined;
    s.inflight = null;
  });
}