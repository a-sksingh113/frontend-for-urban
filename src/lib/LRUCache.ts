// /lib/LRUCache.ts
export class LRUCache<K, V> {
  private map = new Map<K, { value: V; expiresAt: number }>();
  constructor(
    private maxEntries: number,
    private ttlMs: number // time-to-live per entry
  ) {}

  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;

    // TTL check
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return undefined;
    }

    // mark as recently used: reinsert to end
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }

  set(key: K, value: V): void {
    // overwrite if exists
    if (this.map.has(key)) this.map.delete(key);

    // evict LRU if full
    while (this.map.size >= this.maxEntries) {
      const lruKey = this.map.keys().next().value as K;
      this.map.delete(lruKey);
    }

    this.map.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.map.clear();
  }
}
