type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const inMemoryCache = new Map<string, CacheEntry<unknown>>();

export async function withCache<T>(
  key: string,
  ttlMs: number,
  producer: () => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const existing = inMemoryCache.get(key) as CacheEntry<T> | undefined;
  if (existing && existing.expiresAt > now) {
    return existing.value;
  }

  const value = await producer();
  inMemoryCache.set(key, {
    value,
    expiresAt: now + ttlMs,
  });

  return value;
}
